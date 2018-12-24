import { createLogger, format, Logger, LoggerOptions, transports } from "winston";
import { ensureFileSync } from "fs-extra";

// tslint:disable-next-line:no-var-requires no-implicit-dependencies
const MESSAGE = require("triple-beam").MESSAGE;

import { IDiscordBotConfigComplete } from "./config";

function format_now(): string
{
    const dt = new Date();
    // return `${dt.getMonth()}/${dt.getDate()}/${dt.getFullYear()} ${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}.${dt.getMilliseconds()}`;
    return dt.toLocaleString();
}

export const bot_format = format((info) => {
    const message = typeof info.message === "string"
        ? info.message
        : '\n' + JSON.stringify(info.message, null, 4);
    info[MESSAGE] = `${format_now()} [${info.level}]: ${message}`;
    return info;
});

export function init_logger(config: IDiscordBotConfigComplete): Logger
{
    const logger_options: LoggerOptions = {
        format: bot_format(),
        level: config.logger.level,
        transports: [  ],
    };
    if(config.logger.output === "console") {
        logger_options.transports = new transports.Console();
    } else {
        ensureFileSync(config.logger.output);
        logger_options.transports = new transports.File({ filename: config.logger.output });
    }
    return createLogger(logger_options);
}
