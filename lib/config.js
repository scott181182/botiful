"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompleteConfig = exports.default_config = void 0;
exports.default_config = {
    token: "",
    prefix: '!',
    admin: "Discord Admin",
    environment: process.env.NODE_ENV ? process.env.NODE_ENV : "development",
    loggerLevel: process.env.NODE_ENV === "production" ? "info" : "debug",
    loggerOutput: "console",
    data: {}
};
function getCompleteConfig(config) {
    return Object.assign(Object.assign({}, exports.default_config), config);
}
exports.getCompleteConfig = getCompleteConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUF5QmEsUUFBQSxjQUFjLEdBQThCO0lBQ3JELEtBQUssRUFBRSxFQUFFO0lBQ1QsTUFBTSxFQUFFLEdBQUc7SUFDWCxLQUFLLEVBQUUsZUFBZTtJQUN0QixXQUFXLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxhQUFhO0lBQ3hFLFdBQVcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTztJQUNyRSxZQUFZLEVBQUUsU0FBUztJQUN2QixJQUFJLEVBQUUsRUFBSTtDQUNiLENBQUM7QUFFRixTQUFnQixpQkFBaUIsQ0FBQyxNQUF5QjtJQUV2RCx1Q0FBWSxzQkFBYyxHQUFLLE1BQU0sRUFBRztBQUM1QyxDQUFDO0FBSEQsOENBR0MifQ==