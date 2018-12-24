import { DiscordBot } from "../lib/index"

/* tslint:disable:no-console */

test('Should load help action', async (done) => {
    expect.hasAssertions();

    const bot = new DiscordBot(`${__dirname}/../private/config.json`);
    return bot.start()
        .then(() => {
            expect(bot.actions().map(action => action.name)).toEqual([ "help" ]);
            return bot.logout().then(() => done());
        })
        .catch((err) => { done.fail(err); });
});
