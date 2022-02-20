export interface IDiscordBotConfig {
    token: string;
    prefix?: string;
    admin?: string;
    environment?: string;
    loggerLevel?: string;
    loggerOutput?: string;
    data?: {
        [key: string]: any;
    };
    intents?: number[];
}
export interface IDiscordBotConfigComplete extends IDiscordBotConfig {
    token: string;
    prefix: string;
    admin: string;
    environment: string;
    loggerLevel: string;
    loggerOutput: string;
    data: {
        [key: string]: any;
    };
    intents?: number[];
}
export declare const default_config: IDiscordBotConfigComplete;
export declare function getCompleteConfig(config: IDiscordBotConfig): IDiscordBotConfigComplete;
