import { config } from 'dotenv';
config();

import { ActivityType, Client, GatewayIntentBits, Partials, PresenceUpdateStatus } from 'discord.js';

import { initEvents } from './events';

const client = new Client({
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.GuildMember,
        Partials.ThreadMember,
        Partials.Reaction,
        Partials.User,
        Partials.GuildScheduledEvent,
    ],
    intents: Object.values(GatewayIntentBits)
        .filter((x) => typeof x === 'number' && !isNaN(x))
        .reduce((bit, next) => (bit |= Number(next)), 0),
    presence: {
        activities: [{ name: `a bot...`, type: ActivityType.Playing }],
        status: PresenceUpdateStatus.Online,
    },
    sweepers: {
        messages: {
            interval: 5 * 60 * 1000,
            lifetime: 1 * 60 * 60 * 1000,
        },
    },
});

// loads events
initEvents(client);

client.login(process.env.DISCORD_TOKEN);

// erst wenn der Bot ready ist bzw. ich war bisschen faul
process.on('unhandledRejection', (reason, p) => {
    console.log(' [antiCrash] :: Unhandled Rejection/Catch');
    console.log(reason, p);
});

process.on('uncaughtException', (err, origin) => {
    console.log(' [antiCrash] :: Uncaught Exception/Catch');
    console.log(err, origin);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(' [antiCrash] :: Uncaught Exception/Catch (MONITOR)');
    console.log(err, origin);
});
