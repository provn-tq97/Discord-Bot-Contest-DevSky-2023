import { reminderDatabase } from './database';
import { Client, EmbedBuilder, TextChannel, User } from 'discord.js';

export const initReminder = async (client: Client) => {
    const reminders = reminderDatabase.array();

    for (let i = 0; i < reminders.length; i++) {
        const reminder = reminders[i];
        const now = new Date().getTime();

        if (now > reminder.sendOn) {
            sendReminder(client, reminder);
        } else {
            setTimeout(() => sendReminder(client, reminder), reminder.sendOn - now);

            continue;
        }
    }
};

export async function sendReminder(client: Client, reminder: any) {
    const user: User | null = await client.users.fetch(reminder.executerId).catch(() => null);
    const key = `${reminder.executerId}_${reminder.createdOn}`;
    const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Reminder !!!')
        .setDescription(reminder.notes || 'Du wurdest wegen irgendwas benachrichtigt... (aka keine Notizen)');

    if (reminder.channelId) {
        const channel = (await client.channels.fetch(reminder.channelId)) as TextChannel;

        if (!channel) {
            if (!user) {
                reminderDatabase.delete(key);
                return;
            }

            await user.send({
                content: `Da ich den Kanal mit dem Id ${reminder.channelId} nicht finden konnte, kriegst du die Benachrichtigung per DM:`,
                embeds: [embed],
            });
            reminderDatabase.delete(key);
            return;
        }

        await channel.send({
            content: `<@${reminder.executerId}>`,
            embeds: [embed],
            allowedMentions: { users: [reminder.executerId] },
        });
        reminderDatabase.delete(key);
    } else {
        if (!user) {
            reminderDatabase.delete(key);
            return;
        }

        await user.send({ embeds: [embed] });
        reminderDatabase.delete(key);
    }
}
