
export interface IDiscordBotConfig
{
    token: string;
    prefix?: string;
    admin?: string;
    environment?: string;
    logger?: {
        level?: string;
        output?: string;
    };
    data?: { [key: string]: any }
}
export interface IDiscordBotConfigComplete
{
    token: string;
    prefix: string;
    admin: string;
    environment: string;
    logger: {
        level: string;
        output: string;
    };
    data: { [key: string]: any };
}
export const default_config: IDiscordBotConfigComplete = {
    token: "",
    prefix: '!',
    admin: "Discord Admin",
    environment: process.env.NODE_ENV ? process.env.NODE_ENV : "development",
    logger: {
        level: process.env.NODE_ENV === "production" ? "info" : "debug",
        output: "console"
    },
    data: {  }
};
