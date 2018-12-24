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
    actions() { return Object.values(this._actions); }
    get_action(command) { return this._actions[command]; }
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
                .filter((action_file) => action_file.endsWith(".js"))
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
                .filter((middleware_file) => middleware_file.endsWith(".js"))
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
                .map((mw) => mw.init())).then(() => Promise.all(this.actions()
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLCtCQUErQztBQUcvQyx1Q0FBcUQ7QUFDckQsMkNBQTBEO0FBRTFELHFDQUE2RDtBQUU3RCxxQ0FBdUM7QUFDdkMscUNBQXFDO0FBQ3JDLDJDQUEyQztBQUUzQyxrQ0FBNkI7QUFHN0I7SUFjSSxZQUFtQixhQUEwQztRQVByRCxhQUFRLEdBQWMsRUFBSSxDQUFDO1FBQzNCLGVBQVUsR0FBa0IsRUFBSSxDQUFDO1FBUXJDLE1BQU0sTUFBTSxxQkFDTCx1QkFBYyxFQUNkLENBQUMsT0FBTyxhQUFhLEtBQUssUUFBUTtZQUNqQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyx1QkFBWSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNqRCxDQUFDLENBQUMsYUFBYSxDQUFDLENBQ3ZCLENBQUM7UUFFRixJQUFJLENBQUMsR0FBRyxHQUFHLG9CQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUM1QixJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDMUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxtQkFBTSxFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUNNLE9BQU8sS0FBSyxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRCxVQUFVLENBQUMsT0FBZSxJQUFJLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENB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