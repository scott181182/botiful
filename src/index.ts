import { resolve as resolve_path } from "path";

import { Logger } from "winston";
import { readFileSync, readdirSync } from "fs-extra";
import { Client, Message, TextChannel } from "discord.js";

import { IDiscordBotConfig, default_config } from "./config";
import { IAction, ActionMap, IMiddleware, IDiscordBot } from "./foundation";
import { init_logger } from "./logger";
import * as actions from "./actions";
import * as middleware from "./middleware";

export * from "./foundation";


export class DiscordBot implements IDiscordBot
{
    public readonly config: { [key: string]: any };
    public readonly log: Logger;
    public readonly client: Client;
    public readonly admin_role: string;

    private _actions: ActionMap = {  };
    private middleware: IMiddleware[] = [  ];
    private readonly prefix: string;
    private readonly token: string;

    public constructor(configuration: IDiscordBotConfig);
    public constructor(configuration: string)
    public constructor(configuration?: IDiscordBotConfig | string)
    {
        const config = {
            ...default_config,
            ...(typeof configuration === "string"
                ? JSON.parse(readFileSync(configuration, "utf8"))
                : configuration)
        };

        this.log = init_logger(config);
        this.config = config.data;
        this.prefix = config.prefix;
        this.token = config.token;
        this.admin_role = config.admin;
        this.client = new Client();
    }
    public actions() { return Object.values(this._actions); }
    public get_action(command: string) { return this._actions[command]; }

    public async logout()
    {
        this.log.debug("Bot shutting down...");
        return this.client.destroy().then(() => this.log.info("Bot logged out!"));
    }



    public async start(): Promise<void>
    {
        await this.init();
        this.log.info("Starting Discord Bot...");

        if(this.token.length === 0) { this.log.error("No token found!"); }
        return this.client.login(this.token).then(() => {
            this.log.info(`${this.client.user.username} has logged in and started!`);
        }).catch((err) => { this.log.error(err); });
    }

    public async run_action(msg: Message): Promise<void>
    {
        if(!msg.content.startsWith(this.prefix)
            || msg.author.equals(this.client.user)) { return; }

        const cmd_regex = /("[^"]*"|\S+)/g;
        let cmd_args = (msg.content.match(cmd_regex) || [  ])
            .map((arg) => /^".*"$/.test(arg)
                ? arg.substring(1, arg.length - 2)
                : arg);
        const cmd = cmd_args[0].substring(1);
        cmd_args = cmd_args.slice(1);

        let reply = `'${cmd}' is not a valid command!`;
        const cmd_action = this._actions[cmd];
        if(cmd_action)
        {
            const authorized = await this.is_authorized(cmd_action, msg);
            if(authorized)
            {
                const str = await cmd_action.run(cmd_args, msg, this);
                reply = (str && (str.length > 0)) ? str : "";
            }
            else
            {
                reply = "You are not authorized to use this command!";
            }
        }
        if(reply.length > 0) { msg.channel.send(reply); }
    }

    public load_actions(actions: IAction[]): void;
    public load_actions(action_directory: string): void;
    public load_actions(action_map: { [name: string]: IAction }): void;
    public load_actions(actions_param: { [name: string]: IAction } | IAction[] | IAction | string): void
    {
        if(typeof actions_param === "string") {
            const action_path = resolve_path(actions_param);
            readdirSync(action_path)
                .filter((action_file) => action_file.endsWith(".js"))
                .map((action_file) => require(`${action_path}/${action_file}`) as { [name: string]: IAction })
                .forEach((action_module) => this.load_actions(action_module));
        } else if(actions_param instanceof Array) {
            actions_param.forEach((action) => { this._actions[action.name] = action; })
        } else if(typeof actions_param === "object") {
            Object.assign(this._actions, actions_param);
        }
    }

    public load_middleware(middleware: IMiddleware): void;
    public load_middleware(middleware: IMiddleware[]): void;
    public load_middleware(middleware_directory: string): void;
    public load_middleware(middleware_param: IMiddleware | IMiddleware[] | string): void
    {
        if(typeof middleware_param === "string") {
            const middleware_path = resolve_path(middleware_param);
            const mws = readdirSync(middleware_path)
                .filter((middleware_file) => middleware_file.endsWith(".js"))
                .map((middleware_file) => require(`${middleware_path}/${middleware_file}`) as { [name: string]: IMiddleware })
                .map((middleware_map) => Object.values(middleware_map))
                .reduce((acc, curr) => acc.concat(curr), [  ] as IMiddleware[]);
            this.load_middleware(mws);
        } else if(middleware_param instanceof Array) {
            this.middleware.concat(middleware_param);
        } else {
            this.middleware.push(middleware_param);
        }
    }



    private async init(): Promise<void>
    {
        this.log.info("Initializing Discord Bot...");
        this.load_actions(actions as { [name: string]: IAction });
        this.load_middleware([ middleware.admin, middleware.roles, middleware.users ]);

        this.client.on("message", async (msg) => this.run_action(msg));
        this.client.on('messageUpdate', async (oldmsg, newmsg) => {
            if((oldmsg.content === newmsg.content)
                || (newmsg.embeds && !oldmsg.embeds)
                || (newmsg.embeds.length > 0 && oldmsg.embeds.length === 0)) { return; }
            else { return this.run_action(newmsg); }
        });

        return Promise.all(
            this.middleware
                .filter((mw) => mw.init)
                .map((mw) => (mw.init as () => void | Promise<void>)())
        ).then(() => Promise.all(
            this.actions
                .filter((action) => action.init)
                .map((action) => (action.init as () => void | Promise<void>)())
        )).then(() => { /* Gotta return Promise<void> */ });
    }

    private async is_authorized(action: IAction, message: Message): Promise<boolean>
    {
        for(const mw of this.middleware)
        {
            if(!(await mw.apply(action, message, this))) {
                return false;
            }
        }
        return true;
    }
}
