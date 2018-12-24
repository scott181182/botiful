import { Logger } from "winston";
import { Client, Message } from "discord.js";
import { IDiscordBotConfig } from "./config";
import { IAction, IMiddleware, IDiscordBot } from "./foundation";
export * from "./foundation";
export declare class DiscordBot implements IDiscordBot {
    readonly config: {
        [key: string]: any;
    };
    readonly log: Logger;
    readonly client: Client;
    readonly admin_role: string;
    private _actions;
    private middleware;
    private readonly prefix;
    private readonly token;
    constructor(configuration: IDiscordBotConfig);
    constructor(configuration: string);
    actions(): IAction[];
    get_action(command: string): IAction;
    logout(): Promise<Logger>;
    start(): Promise<void>;
    run_action(msg: Message): Promise<void>;
    load_actions(actions: IAction[]): void;
    load_actions(action_directory: string): void;
    load_actions(action_map: {
        [name: string]: IAction;
    }): void;
    load_middleware(middleware: IMiddleware): void;
    load_middleware(middleware: IMiddleware[]): void;
    load_middleware(middleware_directory: string): void;
    private init;
    private is_authorized;
}
