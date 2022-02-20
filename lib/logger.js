"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initLogger = exports.botFormat = void 0;
const winston_1 = require("winston");
const fs_extra_1 = require("fs-extra");
function formatNow() {
    const dt = new Date();
    return dt.toLocaleString();
}
exports.botFormat = (0, winston_1.format)((info) => {
    const message = typeof info.message === "string"
        ? info.message
        : '\n' + JSON.stringify(info.message, null, 4);
    info.message = `${formatNow()} [${info.level}]: ${message}`;
    return info;
});
function initLogger(config) {
    const logger_options = {
        format: (0, exports.botFormat)(),
        level: config.loggerLevel,
        transports: [],
    };
    if (config.loggerOutput === "console") {
        logger_options.transports = new winston_1.transports.Console();
    }
    else {
        (0, fs_extra_1.ensureFileSync)(config.loggerOutput);
        logger_options.transports = new winston_1.transports.File({ filename: config.loggerOutput });
    }
    return (0, winston_1.createLogger)(logger_options);
}
exports.initLogger = initLogger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBa0Y7QUFDbEYsdUNBQTBDO0FBTTFDLFNBQVMsU0FBUztJQUNkLE1BQU0sRUFBRSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7SUFFdEIsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDL0IsQ0FBQztBQUVZLFFBQUEsU0FBUyxHQUFHLElBQUEsZ0JBQU0sRUFBQyxDQUFDLElBQUksRUFBRSxFQUFFO0lBQ3JDLE1BQU0sT0FBTyxHQUFHLE9BQU8sSUFBSSxDQUFDLE9BQU8sS0FBSyxRQUFRO1FBQzVDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTztRQUNkLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNuRCxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsU0FBUyxFQUFFLEtBQUssSUFBSSxDQUFDLEtBQUssTUFBTSxPQUFPLEVBQUUsQ0FBQztJQUM1RCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDLENBQUMsQ0FBQztBQUVILFNBQWdCLFVBQVUsQ0FBQyxNQUFpQztJQUV4RCxNQUFNLGNBQWMsR0FBa0I7UUFDbEMsTUFBTSxFQUFFLElBQUEsaUJBQVMsR0FBRTtRQUNuQixLQUFLLEVBQUUsTUFBTSxDQUFDLFdBQVc7UUFDekIsVUFBVSxFQUFFLEVBQUk7S0FDbkIsQ0FBQztJQUNGLElBQUcsTUFBTSxDQUFDLFlBQVksS0FBSyxTQUFTLEVBQUU7UUFDbEMsY0FBYyxDQUFDLFVBQVUsR0FBRyxJQUFJLG9CQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDeEQ7U0FBTTtRQUNILElBQUEseUJBQWMsRUFBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDcEMsY0FBYyxDQUFDLFVBQVUsR0FBRyxJQUFJLG9CQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0tBQ3RGO0lBQ0QsT0FBTyxJQUFBLHNCQUFZLEVBQUMsY0FBYyxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQWRELGdDQWNDIn0=