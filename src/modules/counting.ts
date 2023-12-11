import { Client, Message } from 'discord.js';
import { evaluate } from 'mathjs';

import { countingDatabase } from './database';

export async function handleCounting(client: Client, message: Message<true>) {
    if (message.author.bot) return;

    const [last_counter_id, current_number]: [string, number] = [
        countingDatabase.get('last_counter_id'),
        countingDatabase.get('current_number'),
    ];

    if (!current_number && current_number !== 0) {
        countingDatabase.set('current_number', 0);
    }

    let number_input;
    try {
        number_input = await evaluate(message.content);
    } catch (error) {
        number_input = 'no';
    }

    if (message.author.id === last_counter_id && last_counter_id) {
        await message.channel
            .send({
                content: `:clock1: ${message.author.toString()}, **du bist nicht dran!**`,
                allowedMentions: { users: [message.author.id] },
            })
            .then((msg) => {
                setTimeout(() => {
                    msg.delete().catch(() => {});
                }, 3000);
            });

        return message.delete().catch(() => {});
    }

    if (!message.content || isNaN(number_input)) {
        await message.channel
            .send({
                content: `:x: ${message.author.toString()}, **das war keine Zahl**`,
                allowedMentions: { users: [message.author.id] },
            })
            .then((msg) => {
                setTimeout(() => {
                    msg.delete().catch(() => {});
                }, 3000);
            });

        return message.delete().catch(() => {});
    }

    if (number_input !== current_number + 1) {
        await message.channel
            .send({
                content: `:x: ${message.author.toString()}, **das war nicht die richtige Zahl**`,
                allowedMentions: { users: [message.author.id] },
            })
            .then((msg) => {
                setTimeout(() => {
                    msg.delete().catch(() => {});
                }, 3000);
            });

        return message.delete().catch(() => {});
    }

    countingDatabase.set('last_counter_id', message.author.id);
    countingDatabase.set('current_number', current_number + 1);
    await message.react('👍');
}
