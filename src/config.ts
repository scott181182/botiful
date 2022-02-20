


export interface IDiscordBotConfig
{
    token: string;
    prefix?: string;
    admin?: string;
    environment?: string;
    loggerLevel?: string;
    loggerOutput?: string;
    data?: { [key: string]: any },
    intents?: number[]
}
export interface IDiscordBotConfigComplete extends IDiscordBotConfig
{
    token: string;
    prefix: string;
    admin: string;
    environment: string;
    loggerLevel: string;
    loggerOutput: string;
    data: { [key: string]: any };
    intents?: number[];
}
export const default_config: IDiscordBotConfigComplete = {
    token: "",
    prefix: '!',
    admin: "Discord Admin",
    environment: process.env.NODE_ENV ? process.env.NODE_ENV : "development",
    loggerLevel: process.env.NODE_ENV === "production" ? "info" : "debug",
    loggerOutput: "console",
    data: {  }
};

export function getCompleteConfig(config: IDiscordBotConfig): IDiscordBotConfigComplete
{
    return { ...default_config, ...config };
}
