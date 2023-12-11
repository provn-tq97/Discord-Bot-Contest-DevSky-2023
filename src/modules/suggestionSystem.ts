import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    Client,
    EmbedBuilder,
    Message,
    TextChannel,
} from 'discord.js';
import { suggestionDatabase } from './database';
import { config } from '../config';

const suggestionLifetime = 2592000000; // 30 days

export const suggestionPanelEmbed = new EmbedBuilder()
    .setColor('#2b2d31')
    .setTitle('💡 › Schlage etwas vor!')
    .setDescription(
        'Hast du eine tolle Idee und möchtest diese mit uns teilen? Dann klicke auf die Schaltfläche und fülle das Formular aus :)',
    );
export const suggestionPanelRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
        .setCustomId('suggestion')
        .setDisabled(false)
        .setEmoji('📝')
        .setLabel('Idee einreichen')
        .setStyle(ButtonStyle.Primary),
);

//TODO: delete suggest after {suggestionLifetime}ms
export const initSuggestionSystem = async (client: Client) => {
    let suggestionMessageId: string = suggestionDatabase.get('suggestion_message_id');

    const channel: TextChannel =
        (await client.channels.fetch(config.suggestionSystemChannelId).catch(() => null)) || null;

    if (!channel || !channel?.isTextBased()) {
        return console.log('error: 423947239');
    }

    if (!suggestionMessageId) {
        const message = await channel.send({ embeds: [suggestionPanelEmbed], components: [suggestionPanelRow] });

        suggestionDatabase.set('suggestion_message_id', message.id);
    }

    const newestMessage = (await channel.messages.fetch({ limit: 1, cache: false })).first();

    if (newestMessage.id !== suggestionDatabase.get('suggestion_message_id')) {
        const message: Message<true> = await channel.messages.fetch({ message: suggestionMessageId }).catch(() => null);

        if (message && message.deletable) {
            message.delete();
        }

        const messageId = (await channel.send({ embeds: [suggestionPanelEmbed], components: [suggestionPanelRow] })).id;

        suggestionDatabase.set('suggestion_message_id', messageId);
    }
};

export const updateSuggestionEmbed = async (client: Client, interaction: ButtonInteraction) => {
    const suggestionData: { upvotes: string[]; downvotes: string[] } = suggestionDatabase.get(interaction.message.id);
    const upvotes = suggestionData.upvotes.length;
    const downvotes = suggestionData.downvotes.length;
    const difference = upvotes - downvotes;

    let opinion = 'unentschieden';
    if (difference > 0) {
        opinion = `dafür \`+${difference}\``;
    } else if (difference < 0) {
        opinion = `dagegen \`${difference}\``;
    }

    const totalVotes = upvotes + downvotes;
    const embed = new EmbedBuilder(interaction.message.embeds[0]);

    embed.setFields({
        name: 'Stimmen',
        value: `Meinung: ${opinion}\nUpvotes: ${suggestionData.upvotes.length} \`${calculatePercentage(
            suggestionData.upvotes.length,
            totalVotes,
        )}%\`\nDownvotes: ${suggestionData.downvotes.length} \`${calculatePercentage(
            suggestionData.downvotes.length,
            totalVotes,
        )}%\``,
    });

    await interaction.message.edit({ embeds: [embed] });
};

const calculatePercentage = (value: number, total: number): string => {
    if (total === 0) {
        return '0';
    }

    const percentage = (value / total) * 100;
    const roundedPercentage = Math.round(percentage * 100) / 100;
    return roundedPercentage.toFixed(2);
};
