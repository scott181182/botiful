import { IMiddleware } from "./foundation";

export const admin: IMiddleware =
{
    apply: (action, message, bot) => !action.admin || message.member.roles.some((role) => role.name === bot.admin_role)
};
export const roles: IMiddleware =
{
    apply: (action, message) => {
        if(!action.roles || action.roles.length === 0) { return true; }
        return message.member.roles.some((member_role) =>
            (action.roles as string[]).some((action_role) =>
                action_role === member_role.name));
    }
};
export const users: IMiddleware =
{
    apply: (action, message) => {
        if(!action.users || action.users.length === 0) { return true; }
        return (action.users as string[]).some((username) => message.author.username === username);
    }
};
