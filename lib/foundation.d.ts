import { Logger } from "winston";
import { Client, Message } from "discord.js";
export interface IDiscordBot {
    readonly config: {
        [key: string]: any;
    };
    readonly log: Logger;
    readonly client: Client;
    readonly admin_role: string;
    actions: () => IAction[];
    get_action: (command: string) => IAction | null;
}
export declare type ActionMap = {
    [name: string]: IAction;
};
export declare type ActionRun = (args: string[], msg: Message, bot: IDiscordBot) => void | string | Promise<void> | Promise<string>;
export interface IAction {
    readonly name: string;
    description: string;
    man?: string;
    readonly admin: boolean;
    roles?: string[];
    users?: string[];
    state?: any;
    readonly init?: (bot: IDiscordBot) => void | Promise<void>;
    readonly run: ActionRun;
    readonly cleanup?: (bot: IDiscordBot) => void | Promise<void>;
}
export declare function verifyAction(maybe_action: any): boolean;
export declare function subcommand(subcmds: {
    [name: string]: ActionRun;
}): ActionRun;
export interface IMiddleware {
    readonly init?: (bot: IDiscordBot) => void | Promise<void>;
    readonly apply: (action: IAction, message: Message, bot: IDiscordBot) => boolean | Promise<boolean>;
}
export declare function verifyMiddleware(maybe_middleware: any): boolean;
