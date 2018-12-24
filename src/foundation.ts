import { Logger } from "winston";
import { Client, Message } from "discord.js";

export interface IDiscordBot
{
    readonly config: { [key: string]: any };
    readonly log: Logger;
    readonly client: Client;
    readonly admin_role: string;

    actions: () => IAction[];
    get_action: (command: string) => IAction | null;
}

export type ActionMap = { [name: string]: IAction };
export type ActionRun = (args: string[], msg: Message, bot: IDiscordBot) => void | string | Promise<void> | Promise<string>;
export interface IAction
{
    readonly name: string;
    description: string;
    man?: string;

    readonly admin: boolean;
    roles?: string[];
    users?: string[];

    state?: any;
    readonly init?: (bot: IDiscordBot) => void | Promise<void>;
    readonly run: ActionRun;
}

export function subcommand(subcmds: { [name: string]: ActionRun }): ActionRun
{
    return (args, msg, bot) => {
        const subcmd_name = args[0];
        const subcmd_args = args.slice(1);

        subcmds[subcmd_name](subcmd_args, msg, bot);
    };
}

export interface IMiddleware
{
    readonly init?: (bot: IDiscordBot) => void | Promise<void>;
    readonly apply: (action: IAction, message: Message, bot: IDiscordBot) => boolean | Promise<boolean>;
}
