import { DiscordBot } from "../lib/index"

/* tslint:disable:no-console */

test('Should print loaded actions', () => {
    expect.assertions(1);

    const bot = new DiscordBot(`${__dirname}/../private/config.json`);
    console.log("Initializing...");
    bot.start()
        .then(() => {
            console.log("Done!");
            expect(true).toBe(true);
        })
        .catch((err) => {
            console.error(err);
            expect(true).toBe(false);
        });
});
