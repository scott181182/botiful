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
exports.man = {
    name: "man",
    description: "Displays the manual entry for a specified command",
    man: "!man <command>",
    admin: false,
    run: (args, msg, bot) => {
        if (!args[0]) {
            msg.channel.send("You must pass in a command to look up the manual entry for.");
            return;
        }
        const command = bot.get_action(args[0]);
        if (!command) {
            msg.channel.send(`Could not find the command '${args[0]}'.`);
            return;
        }
        if (!command.man) {
            msg.channel.send(`The '${args[0]}' command does not have a manual entry.`);
            return;
        }
        msg.channel.send(command.man);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9hY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRWEsUUFBQSxJQUFJLEdBQ2pCO0lBQ0ksSUFBSSxFQUFFLE1BQU07SUFDWixXQUFXLEVBQUUsa0RBQWtEO0lBQy9ELEtBQUssRUFBRSxLQUFLO0lBQ1osR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUNwQixPQUFPLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksTUFBTSxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUYsQ0FBQztDQUNKLENBQUM7QUFFVyxRQUFBLEdBQUcsR0FDaEI7SUFDSSxJQUFJLEVBQUUsS0FBSztJQUNYLFdBQVcsRUFBRSxtREFBbUQ7SUFDaEUsR0FBRyxFQUFFLGdCQUFnQjtJQUNyQixLQUFLLEVBQUUsS0FBSztJQUNaLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDcEIsSUFBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNULEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLDZEQUE2RCxDQUFDLENBQUM7WUFDaEYsT0FBTztTQUNWO1FBQ0QsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxJQUFHLENBQUMsT0FBTyxFQUFFO1lBQ1QsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsK0JBQStCLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0QsT0FBTztTQUNWO1FBQ0QsSUFBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUU7WUFDYixHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMseUNBQXlDLENBQUMsQ0FBQztZQUMzRSxPQUFPO1NBQ1Y7UUFDRCxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEMsQ0FBQztDQUNKLENBQUMifQ==