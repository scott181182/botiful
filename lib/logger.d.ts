import { Logger } from "winston";
import { IDiscordBotConfigComplete } from "./config";
export declare const bot_format: import("logform").FormatWrap;
export declare function init_logger(config: IDiscordBotConfigComplete): Logger;
