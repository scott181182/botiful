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
const path_1 = require("path");
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
                msg.channel.send(reply);
            }
        });
    }
    load_actions(actions_param) {
        if (typeof actions_param === "string") {
            const action_path = path_1.resolve(actions_param);
            fs_extra_1.readdirSync(action_path)
                .map((action_file) => require(`${action_path}/${action_file}`))
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
            const middleware_path = path_1.resolve(middleware_param);
            const mws = fs_extra_1.readdirSync(middleware_path)
                .map((middleware_file) => require(`${middleware_path}/${middleware_file}`))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLCtCQUErQztBQUcvQyx1Q0FBcUQ7QUFDckQsMkNBQTBEO0FBRTFELHFDQUE2RDtBQUU3RCxxQ0FBdUM7QUFDdkMscUNBQXFDO0FBQ3JDLDJDQUEyQztBQUUzQyxrQ0FBNkI7QUFHN0I7SUFlSSxZQUFtQixhQUEwQztRQVByRCxhQUFRLEdBQWdDLEVBQUksQ0FBQztRQUM3QyxlQUFVLEdBQWtCLEVBQUksQ0FBQztRQVFyQyxNQUFNLE1BQU0scUJBQ0wsdUJBQWMsRUFDZCxDQUFDLE9BQU8sYUFBYSxLQUFLLFFBQVE7WUFDakMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsdUJBQVksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDakQsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUN2QixDQUFDO1FBRUYsSUFBSSxDQUFDLEdBQUcsR0FBRyxvQkFBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztRQUMxQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksbUJBQU0sRUFBRSxDQUFDO0lBQy9CLENBQUM7SUF4QkQsSUFBSSxPQUFPLEtBQWdCLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBMEJwRCxNQUFNOztZQUVmLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7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