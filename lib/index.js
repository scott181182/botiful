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
const foundation_1 = require("./foundation");
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
            return Promise.all(this.actions()
                .filter(action => action.cleanup)
                .map(action => action.cleanup()))
                .then(() => this.client.destroy())
                .then(() => this.log.info("Bot logged out!"));
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
                .map((action_file) => {
                const mod = require(`${action_path}/${action_file}`);
                return Object.values(mod).filter((maybe_action_module) => foundation_1.verifyAction(maybe_action_module));
            })
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
                .reduce((acc, curr) => acc.concat(curr), [])
                .filter((maybe_middleware) => foundation_1.verifyMiddleware(maybe_middleware));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLCtCQUErQztBQUcvQyx1Q0FBcUQ7QUFDckQsMkNBQTBEO0FBRTFELHFDQUE2RDtBQUM3RCw2Q0FBNEc7QUFDNUcscUNBQXVDO0FBQ3ZDLHFDQUFxQztBQUNyQywyQ0FBMkM7QUFFM0Msa0NBQTZCO0FBRzdCO0lBY0ksWUFBbUIsYUFBMEM7UUFQckQsYUFBUSxHQUFjLEVBQUksQ0FBQztRQUMzQixlQUFVLEdBQWtCLEVBQUksQ0FBQztRQVFyQyxNQUFNLE1BQU0scUJBQ0wsdUJBQWMsRUFDZCxDQUFDLE9BQU8sYUFBYSxLQUFLLFFBQVE7WUFDakMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsdUJBQVksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDakQsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUN2QixDQUFDO1FBRUYsSUFBSSxDQUFDLEdBQUcsR0FBRyxvQkFBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztRQUMxQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksbUJBQU0sRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFDTSxPQUFPLEtBQUssT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEQsVUFBVSxDQUFDLE9BQWUsSUFBSSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFD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