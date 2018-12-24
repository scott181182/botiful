"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.help = {
    name: "help",
    description: "Displays a list of all commands available to you",
    admin: false,
    run: (args, msg, bot) => {
        return bot.actions().map((action) => `${action.name} : ${action.description}`).join('\n');
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9hY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRWEsUUFBQSxJQUFJLEdBQ2pCO0lBQ0ksSUFBSSxFQUFFLE1BQU07SUFDWixXQUFXLEVBQUUsa0RBQWtEO0lBQy9ELEtBQUssRUFBRSxLQUFLO0lBQ1osR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUNwQixPQUFPLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksTUFBTSxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUYsQ0FBQztDQUNKLENBQUMifQ==