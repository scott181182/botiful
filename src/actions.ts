import { IAction } from "./foundation";

export const help: IAction =
{
    name: "help",
    description: "Displays a list of all commands available to you",
    admin: false,
    run: (args, msg, bot) => {
        return bot.actions.map((action) => `${action.name} : ${action.description}`).join('\n');
    }
};
