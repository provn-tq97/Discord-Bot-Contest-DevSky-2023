import { Client, Interaction } from 'discord.js';
import { handleSlashCommands } from '../modules/slashCommandHandler';
import { publishSlashCommands } from '../modules/publishSlashCommands';
import { initReminder } from '../modules/reminder';
import { initSuggestionSystem, suggestionPanelEmbed, suggestionPanelRow } from '../modules/suggestionSystem';
import { handleModals } from '../modules/modalHandler';
import { handleButtons } from '../modules/buttonHandler';
import { handleFlagQuizAnswer, initFlagQuiz } from '../modules/flagQuiz';
import { config } from '../config';
import { handleCounting } from '../modules/counting';

export const initEvents = (client: Client) => {
    client.on('ready', async () => {
        console.log(`Login as ${client.user.username}`);

        await publishSlashCommands(client);

        initReminder(client);
        initSuggestionSystem(client);
        initFlagQuiz(client);
    });

    client.on('interactionCreate', (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) return handleSlashCommands(client, interaction);
        else if (interaction.isModalSubmit()) return handleModals(client, interaction);
        else if (interaction.isButton()) return handleButtons(client, interaction);
    });

    // client.on('messageDelete', (message) => {
    //     if (message.id === suggestionDatabase.get('suggestion_message_id')) {
    //         message.channel.send({ embeds: [suggestionPanelEmbed], components: [suggestionPanelRow] });
    //     }
    // });

    client.on('messageCreate', (message) => {
        if (!message.inGuild()) return;

        if (message.channelId === config.flagQuizChannelId) return handleFlagQuizAnswer(client, message);
        else if (message.channelId === config.countingChannelId) return handleCounting(client, message);
    });
};
