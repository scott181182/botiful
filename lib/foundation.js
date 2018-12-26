"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function verifyAction(maybe_action) {
    if (typeof maybe_action !== "object") {
        return false;
    }
    ;
    const props = Object.getOwnPropertyNames(maybe_action);
    const hasRequiredFields = ["name", "description", "admin", "run"].every(p => props.includes(p));
    return hasRequiredFields && (typeof maybe_action.run === "function");
}
exports.verifyAction = verifyAction;
function subcommand(subcmds) {
    return (args, msg, bot) => {
        const subcmd_name = args[0];
        const subcmd_args = args.slice(1);
        subcmds[subcmd_name](subcmd_args, msg, bot);
    };
}
exports.subcommand = subcommand;
function verifyMiddleware(maybe_middleware) {
    if (typeof maybe_middleware !== "object") {
        return false;
    }
    ;
    const props = Object.getOwnPropertyNames(maybe_middleware);
    return typeof maybe_middleware.apply === "function";
}
exports.verifyMiddleware = verifyMiddleware;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm91bmRhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9mb3VuZGF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBK0JBLHNCQUE2QixZQUFpQjtJQUUxQyxJQUFHLE9BQU8sWUFBWSxLQUFLLFFBQVEsRUFBRTtRQUFFLE9BQU8sS0FBSyxDQUFDO0tBQUU7SUFBQSxDQUFDO0lBQ3ZELE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN2RCxNQUFNLGlCQUFpQixHQUFHLENBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xHLE9BQU8saUJBQWlCLElBQUksQ0FBQyxPQUFPLFlBQVksQ0FBQyxHQUFHLEtBQUssVUFBVSxDQUFDLENBQUM7QUFDekUsQ0FBQztBQU5ELG9DQU1DO0FBRUQsb0JBQTJCLE9BQXNDO0lBRTdELE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQ3RCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWxDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ2hELENBQUMsQ0FBQztBQUNOLENBQUM7QUFSRCxnQ0FRQztBQU9ELDBCQUFpQyxnQkFBcUI7SUFFbEQsSUFBRyxPQUFPLGdCQUFnQixLQUFLLFFBQVEsRUFBRTtRQUFFLE9BQU8sS0FBSyxDQUFDO0tBQUU7SUFBQSxDQUFDO0lBQzNELE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzNELE9BQU8sT0FBTyxnQkFBZ0IsQ0FBQyxLQUFLLEtBQUssVUFBVSxDQUFDO0FBQ3hELENBQUM7QUFMRCw0Q0FLQyJ9