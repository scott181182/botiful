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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFrRjtBQUNsRix1Q0FBMEM7QUFHMUMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUkvQyxTQUFTLFVBQVU7SUFFZixNQUFNLEVBQUUsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0lBRXRCLE9BQU8sRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQy9CLENBQUM7QUFFWSxRQUFBLFVBQVUsR0FBRyxnQkFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7SUFDdEMsTUFBTSxPQUFPLEdBQUcsT0FBTyxJQUFJLENBQUMsT0FBTyxLQUFLLFFBQVE7UUFDNUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPO1FBQ2QsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ25ELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLFVBQVUsRUFBRSxLQUFLLElBQUksQ0FBQyxLQUFLLE1BQU0sT0FBTyxFQUFFLENBQUM7SUFDOUQsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQyxDQUFDLENBQUM7QUFFSCxTQUFnQixXQUFXLENBQUMsTUFBaUM7SUFFekQsTUFBTSxjQUFjLEdBQWtCO1FBQ2xDLE1BQU0sRUFBRSxrQkFBVSxFQUFFO1FBQ3BCLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUs7UUFDMUIsVUFBVSxFQUFFLEVBQUk7S0FDbkIsQ0FBQztJQUNGLElBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO1FBQ25DLGNBQWMsQ0FBQyxVQUFVLEdBQUcsSUFBSSxvQkFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ3hEO1NBQU07UUFDSCx5QkFBYyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckMsY0FBYyxDQUFDLFVBQVUsR0FBRyxJQUFJLG9CQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztLQUN2RjtJQUNELE9BQU8sc0JBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBZEQsa0NBY0MifQ==