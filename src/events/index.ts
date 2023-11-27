import { ChatInputCommandInteraction, Client } from 'discord.js';
import { handleSlashCommands } from '../modules/slashCommandHandler';
import { publishSlashCommands } from '../modules/publishSlashCommands';
import { initReminder } from '../modules/reminder';

export const initEvents = (client: Client) => {
    client.on('ready', async () => {
        console.log(`Login as ${client.user.username}`);

        await publishSlashCommands(client);

        initReminder(client);
    });

    client.on('interactionCreate', (interaction: ChatInputCommandInteraction) => {
        if (interaction.isChatInputCommand()) return handleSlashCommands(client, interaction);
    });
};
