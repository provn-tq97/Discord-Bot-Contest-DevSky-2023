import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client,
    EmbedBuilder,
    Message,
    ModalSubmitInteraction,
    TextChannel,
} from 'discord.js';
import { suggestionDatabase } from './database';
import { suggestionPanelEmbed, suggestionPanelRow } from './suggestionSystem';

export async function handleModals(client: Client, interaction: ModalSubmitInteraction): Promise<any> {
    switch (interaction.customId) {
        case 'suggestion':
            {
                await interaction.deferReply({ ephemeral: true });

                let suggestionMessageId: string = suggestionDatabase.get('suggestion_message_id');
                const inputTitle = interaction.fields.getTextInputValue('suggestion_input_title');
                const inputMain = interaction.fields.getTextInputValue('suggestion_input_main');

                const embed = new EmbedBuilder()
                    .setColor('#2b2d31')
                    .setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.username })
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setTitle(inputTitle)
                    .setDescription(inputMain)
                    .addFields({
                        name: 'Stimmen',
                        value: 'Meinung: unentschieden `0`\nUpvotes: 0 `0%`\nDownvotes: 0 `0%`',
                    });
                const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId('suggestion_upvote')
                        .setDisabled(false)
                        .setEmoji('👍')
                        .setLabel('Dafür')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('suggestion_downvote')
                        .setDisabled(false)
                        .setEmoji('👎')
                        .setLabel('Dagegen')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('suggestion_view')
                        .setDisabled(false)
                        .setEmoji('❓')
                        .setLabel('Wer hat abgestimmt?')
                        .setStyle(ButtonStyle.Primary),
                );

                const message: Message<true> = await interaction.channel.messages
                    .fetch({ message: suggestionMessageId })
                    .catch(() => null);

                if (message && message?.deletable) {
                    message.delete().catch(() => console.log('error: 2203473287321'));
                }

                await interaction.channel.send({ embeds: [embed], components: [row] }).then(async (message) => {
                    suggestionDatabase.set(message.id, { upvotes: [], downvotes: [] });

                    await (interaction.channel as TextChannel).threads
                        .create({
                            startMessage: message,
                            name: inputTitle,
                            autoArchiveDuration: 10080,
                        })
                        .then((thread) => thread.members.add(interaction.user.id));
                });
                await interaction.channel
                    .send({ embeds: [suggestionPanelEmbed], components: [suggestionPanelRow] })
                    .then((message) => suggestionDatabase.set('suggestion_message_id', message.id));

                interaction.editReply({ content: '✅ › Dein Vorschlag wurde erfolgreich erstellt!' });
            }
            break;

        default:
            interaction.reply({ content: 'error: 92348903248' });
            break;
    }
}
