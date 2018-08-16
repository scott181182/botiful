"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const fs_extra_1 = require("fs-extra");
const MESSAGE = require("triple-beam").MESSAGE;
function format_now() {
    const dt = new Date();
    return dt.toLocaleString();
}
exports.bot_format = winston_1.format((info) => {
    const message = typeof info.message === "string"
        ? info.message
        : '\n' + JSON.stringify(info.message, null, 4);
    info[MESSAGE] = `${format_now()} [${info.level}]: ${message}`;
    return info;
});
function init_logger(config) {
    const logger_options = {
        format: exports.bot_format(),
        level: config.logger.level,
        transports: [],
    };
    if (config.logger.output === "console") {
        logger_options.transports = new winston_1.transports.Console();
    }
    else {
        fs_extra_1.ensureFileSync(config.logger.output);
        logger_options.transports = new winston_1.transports.File({ filename: config.logger.output });
    }
    return winston_1.createLogger(logger_options);
}
exports.init_logger = init_logger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFrRjtBQUNsRix1Q0FBMEM7QUFHMUMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUkvQztJQUVJLE1BQU0sRUFBRSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7SUFFdEIsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDL0IsQ0FBQztBQUVZLFFBQUEsVUFBVSxHQUFHLGdCQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtJQUN0QyxNQUFNLE9BQU8sR0FBRyxPQUFPLElBQUksQ0FBQyxPQUFPLEtBQUssUUFBUTtRQUM1QyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU87UUFDZCxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsVUFBVSxFQUFFLEtBQUssSUFBSSxDQUFDLEtBQUssTUFBTSxPQUFPLEVBQUUsQ0FBQztJQUM5RCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDLENBQUMsQ0FBQztBQUVILHFCQUE0QixNQUFpQztJQUV6RCxNQUFNLGNBQWMsR0FBa0I7UUFDbEMsTUFBTSxFQUFFLGtCQUFVLEVBQUU7UUFDcEIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSztRQUMxQixVQUFVLEVBQUUsRUFBSTtLQUNuQixDQUFDO0lBQ0YsSUFBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7UUFDbkMsY0FBYyxDQUFDLFVBQVUsR0FBRyxJQUFJLG9CQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDeEQ7U0FBTTtRQUNILHlCQUFjLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyQyxjQUFjLENBQUMsVUFBVSxHQUFHLElBQUksb0JBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0tBQ3ZGO0lBQ0QsT0FBTyxzQkFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFkRCxrQ0FjQyJ9