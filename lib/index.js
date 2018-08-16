"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const discord_js_1 = require("discord.js");
const config_1 = require("./config");
const logger_1 = require("./logger");
const actions = require("./actions");
const middleware = require("./middleware");
__export(require("./foundation"));
class DiscordBot {
    constructor(configuration) {
        this._actions = {};
        this.middleware = [];
        const config = Object.assign({}, config_1.default_config, (typeof configuration === "string"
            ? JSON.parse(fs_extra_1.readFileSync(configuration, "utf8"))
            : configuration));
        this.log = logger_1.init_logger(config);
        this.config = config.data;
        this.prefix = config.prefix;
        this.token = config.token;
        this.admin_role = config.admin;
        this.client = new discord_js_1.Client();
    }
    get actions() { return Object.values(this._actions); }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log.debug("Bot shutting down...");
            return this.client.destroy().then(() => this.log.info("Bot logged out!"));
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init();
            this.log.info("Starting Discord Bot...");
            if (this.token.length === 0) {
                this.log.error("No token found!");
            }
            return this.client.login(this.token).then(() => {
                this.log.info(`${this.client.user.username} has logged in and started!`);
            }).catch((err) => { this.log.error(err); });
        });
    }
    run_action(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!msg.content.startsWith(this.prefix)
                || msg.author.equals(this.client.user)) {
                return;
            }
            const cmd_regex = /("[^"]*"|\S+)/g;
            let cmd_args = (msg.content.match(cmd_regex) || [])
                .map((arg) => /^".*"$/.test(arg)
                ? arg.substring(1, arg.length - 2)
                : arg);
            const cmd = cmd_args[0].substring(1);
            cmd_args = cmd_args.slice(1);
            let reply = `'${cmd}' is not a valid command!`;
            const cmd_action = this._actions[cmd];
            if (cmd_action) {
                const authorized = yield this.is_authorized(cmd_action, msg);
                if (authorized) {
                    const str = yield cmd_action.run(cmd_args, msg, this);
                    reply = (str && (str.length > 0)) ? str : "";
                }
                else {
                    reply = "You are not authorized to use this command!";
                }
            }
            if (reply.length > 0) {
                msg.channel.sendMessage(reply);
            }
        });
    }
    load_actions(actions_param) {
        if (typeof actions_param === "string") {
            fs_extra_1.readdirSync(actions_param)
                .map((action_file) => require(`${actions_param}/${action_file}`))
                .forEach((action_module) => this.load_actions(action_module));
        }
        else if (actions_param instanceof Array) {
            actions_param.forEach((action) => { this._actions[action.name] = action; });
        }
        else if (typeof actions_param === "object") {
            Object.assign(this._actions, actions_param);
        }
    }
    load_middleware(middleware_param) {
        if (typeof middleware_param === "string") {
            const mws = fs_extra_1.readdirSync(middleware_param)
                .map((middleware_file) => require(`${middleware_param}/${middleware_file}`))
                .map((middleware_map) => Object.values(middleware_map))
                .reduce((acc, curr) => acc.concat(curr), []);
            this.load_middleware(mws);
        }
        else if (middleware_param instanceof Array) {
            this.middleware.concat(middleware_param);
        }
        else {
            this.middleware.push(middleware_param);
        }
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log.info("Initializing Discord Bot...");
            this.load_actions(actions);
            this.load_middleware([middleware.admin, middleware.roles, middleware.users]);
            this.client.on("message", (msg) => __awaiter(this, void 0, void 0, function* () { return this.run_action(msg); }));
            this.client.on('messageUpdate', (oldmsg, newmsg) => __awaiter(this, void 0, void 0, function* () {
                if ((oldmsg.content === newmsg.content)
                    || (newmsg.embeds && !oldmsg.embeds)
                    || (newmsg.embeds.length > 0 && oldmsg.embeds.length === 0)) {
                    return;
                }
                else {
                    return this.run_action(newmsg);
                }
            }));
            return Promise.all(this.middleware
                .filter((mw) => mw.init)
                .map((mw) => mw.init())).then(() => Promise.all(this.actions
                .filter((action) => action.init)
                .map((action) => action.init()))).then(() => { });
        });
    }
    is_authorized(action, message) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const mw of this.middleware) {
                if (!(yield mw.apply(action, message, this))) {
                    return false;
                }
            }
            return true;
        });
    }
}
exports.DiscordBot = DiscordBot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNBLHVDQUFxRDtBQUNyRCwyQ0FBMEQ7QUFFMUQscUNBQTZEO0FBRTdELHFDQUF1QztBQUN2QyxxQ0FBcUM7QUFDckMsMkNBQTJDO0FBRTNDLGtDQUE2QjtBQUc3QjtJQWVJLFlBQW1CLGFBQTBDO1FBUHJELGFBQVEsR0FBZ0MsRUFBSSxDQUFDO1FBQzdDLGVBQVUsR0FBa0IsRUFBSSxDQUFDO1FBUXJDLE1BQU0sTUFBTSxxQkFDTCx1QkFBYyxFQUNkLENBQUMsT0FBTyxhQUFhLEtBQUssUUFBUTtZQUNqQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyx1QkFBWSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNqRCxDQUFDLENBQUMsYUFBYSxDQUFDLENBQ3ZCLENBQUM7UUFFRixJQUFJLENBQUMsR0FBRyxHQUFHLG9CQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUM1QixJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDMUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxtQkFBTSxFQUFFLENBQUM7SUFDL0IsQ0FBQztJQXhCRCxJQUFJLE9BQU8sS0FBZ0IsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUEwQnBELE1BQU07O1lBRWYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUN2QyxPQUFPLElB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