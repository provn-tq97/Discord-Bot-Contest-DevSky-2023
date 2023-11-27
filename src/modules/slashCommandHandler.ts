import { ChannelType, ChatInputCommandInteraction, Client, TextChannel } from 'discord.js';
import ms from 'ms';
import { reminderDatabase } from './database';
import { sendReminder } from './reminder';

export async function handleSlashCommands(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
    switch (interaction.commandName) {
        case 'remind':
            {
                // Für den Fall der Fälle
                await interaction.deferReply({ ephemeral: true });

                const { user } = interaction;
                const now = new Date().getTime();
                const time = ms(interaction.options.getString('zeit', true));
                const notes = interaction.options.getString('notiz', false);
                let channel = interaction.options.getChannel('kanal', false, [ChannelType.GuildText]);

                if (isNaN(time))
                    return interaction.editReply({
                        content: `Kannst du die Dauer richtig schreiben wie alle anderen? z.B.: 3d`,
                    });

                const data = {
                    executerId: user.id,
                    channelId: channel?.id,
                    notes: notes,
                    createdOn: now,
                    sendOn: now + time,
                };

                // damit es nichts doppelt gibt (hoffentlich)
                reminderDatabase.set(`${user.id}_${now}`, data);

                setTimeout(() => sendReminder(client, data), data.sendOn - now);

                interaction.editReply({
                    content: `Du wirst in <t:${Math.round((now + time) / 1000)}:R> benachrichtigt`,
                });
            }
            break;

        default:
            interaction.reply({ content: 'error: 213214' });
            break;
    }
}
