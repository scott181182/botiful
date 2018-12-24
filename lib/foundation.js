"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function subcommand(subcmds) {
    return (args, msg, bot) => {
        const subcmd_name = args[0];
        const subcmd_args = args.slice(1);
        subcmds[subcmd_name](subcmd_args, msg, bot);
    };
}
exports.subcommand = subcommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm91bmRhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9mb3VuZGF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBZ0NBLG9CQUEyQixPQUFzQztJQUU3RCxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUN0QixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVsQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNoRCxDQUFDLENBQUM7QUFDTixDQUFDO0FBUkQsZ0NBUUMifQ==