export interface IDiscordBotConfig {
    token: string;
    prefix?: string;
    admin?: string;
    environment?: string;
    logger?: {
        level?: string;
        output?: string;
    };
    data?: {
        [key: string]: any;
    };
}
export interface IDiscordBotConfigComplete {
    token: string;
    prefix: string;
    admin: string;
    environment: string;
    logger: {
        level: string;
        output: string;
    };
    data: {
        [key: string]: any;
    };
}
export declare const default_config: IDiscordBotConfigComplete;
