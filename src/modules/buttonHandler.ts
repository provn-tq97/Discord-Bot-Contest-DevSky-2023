import {
    Client,
    ButtonInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    EmbedBuilder,
} from 'discord.js';
import { flagQuizDatabase, suggestionDatabase } from './database';
import { updateSuggestionEmbed } from './suggestionSystem';
import { flagQuizPanelEmbed, flagQuizPanelRow, languageCodes } from './flagQuiz';

export let flag_quiz_skip_in_process: boolean = false;
let flag_quiz_last_global_skip: number = 0;

export async function handleButtons(client: Client, interaction: ButtonInteraction): Promise<any> {
    switch (interaction.customId) {
        case 'suggestion':
            {
                const modal = new ModalBuilder().setCustomId('suggestion').setTitle('Idee einreichen!');

                const input1 = new TextInputBuilder()
                    .setCustomId('suggestion_input_title')
                    .setLabel('Titel deines Idee')
                    .setPlaceholder('Fasse deine Idee in paar Wort oder weniger zusamme')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(256);

                const input2 = new TextInputBuilder()
                    .setCustomId('suggestion_input_main')
                    .setLabel('Erzähle uns von deine Idee')
                    .setPlaceholder('Mein Idee ist...')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setMaxLength(2000);

                const input1ActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(input1);
                const input2ActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(input2);

                modal.addComponents(input1ActionRow, input2ActionRow);

                await interaction.showModal(modal);
            }
            break;

        case 'suggestion_upvote':
            {
                await interaction.deferReply({ ephemeral: true });

                let suggestionData: { upvotes: string[]; downvotes: string[] } = suggestionDatabase.get(
                    interaction.message.id,
                );

                if (!suggestionData) {
                    return interaction.editReply({ content: 'Ungültiger Vorschlag :(' });
                }

                // beim wechseln der Stimme muss man zwei mal drücken aka faulheit
                let response = '';
                if (suggestionData.upvotes.includes(interaction.user.id)) {
                    const indexUpvote = suggestionData.upvotes.indexOf(interaction.user.id);
                    suggestionData.upvotes.splice(indexUpvote, 1);
                    response = 'Du hast deine Stimme entfernt :(';
                } else if (suggestionData.downvotes.includes(interaction.user.id)) {
                    const indexDownvote = suggestionData.downvotes.indexOf(interaction.user.id);
                    suggestionData.downvotes.splice(indexDownvote, 1);
                    response = 'Du hast deine Stimme entfernt :(';
                } else {
                    suggestionData.upvotes.push(interaction.user.id);
                    response = 'Danke für deine Stimme!';
                }

                suggestionDatabase.set(interaction.message.id, suggestionData);

                await updateSuggestionEmbed(client, interaction);

                interaction.editReply({ content: response });
            }
            break;

        case 'suggestion_downvote':
            {
                await interaction.deferReply({ ephemeral: true });

                let suggestionData: { upvotes: string[]; downvotes: string[] } = suggestionDatabase.get(
                    interaction.message.id,
                );

                if (!suggestionData) {
                    return interaction.editReply({ content: 'Ungültiger Vorschlag :(' });
                }

                // beim wechseln der Stimme muss man zwei mal drücken aka faulheit
                let response = '';
                if (suggestionData.downvotes.includes(interaction.user.id)) {
                    const indexDownvote = suggestionData.downvotes.indexOf(interaction.user.id);
                    suggestionData.downvotes.splice(indexDownvote, 1);
                    response = 'Du hast deine Stimme entfernt :(';
                } else if (suggestionData.upvotes.includes(interaction.user.id)) {
                    const indexUpvote = suggestionData.upvotes.indexOf(interaction.user.id);
                    suggestionData.upvotes.splice(indexUpvote, 1);
                    response = 'Du hast deine Stimme entfernt :(';
                } else {
                    suggestionData.downvotes.push(interaction.user.id);
                    response = 'Danke für deine Stimme!';
                }

                suggestionDatabase.set(interaction.message.id, suggestionData);

                await updateSuggestionEmbed(client, interaction);

                interaction.editReply({ content: response });
            }
            break;

        case 'suggestion_view':
            {
                await interaction.deferReply({ ephemeral: true });

                let suggestionData: { upvotes: string[]; downvotes: string[] } = suggestionDatabase.get(
                    interaction.message.id,
                );

                if (!suggestionData) {
                    return interaction.editReply({ content: 'Ungültiger Vorschlag :(' });
                }

                const embed = new EmbedBuilder()
                    .setColor('#2b2d31')
                    .setTitle('❓ › Wer hat abgestimmt?')
                    .addFields(
                        {
                            name: `${suggestionData.upvotes.length} Dafür`,
                            value: `${
                                suggestionData.upvotes && suggestionData.upvotes.length > 0
                                    ? suggestionData.upvotes.length < 20
                                        ? suggestionData.upvotes.map((userId) => `<@${userId}>`).join('\n')
                                        : [
                                              ...suggestionData.upvotes.slice(0, 20).map((userId) => `<@${userId}>`),
                                              `${suggestionData.upvotes.length - 20} mehr...`,
                                          ].join('\n')
                                    : 'Niemand'
                            }`,
                            inline: true,
                        },
                        {
                            name: `${suggestionData.downvotes.length} Dagegen`,
                            value: `${
                                suggestionData.downvotes && suggestionData.downvotes.length > 0
                                    ? suggestionData.downvotes.length < 20
                                        ? suggestionData.downvotes.map((userId) => `<@${userId}>`).join('\n')
                                        : [
                                              ...suggestionData.downvotes.slice(0, 20).map((userId) => `<@${userId}>`),
                                              `${suggestionData.downvotes.length - 20} mehr...`,
                                          ].join('\n')
                                    : 'Niemand'
                            }`,
                            inline: true,
                        },
                    );

                interaction.editReply({ embeds: [embed] });
            }
            break;

        case 'flag_quiz_skip':
            {
                const now = new Date().getTime();
                if (flag_quiz_last_global_skip > now) {
                    return interaction.reply({ content: `⏲️ › Du musst noch warten...`, ephemeral: true });
                }
                if (flag_quiz_skip_in_process) {
                    return interaction.reply({ content: '❌ › Lustig...', ephemeral: true });
                }

                await interaction.reply({
                    ephemeral: true,
                    content: '⏱️ › Das Flaggenquiz wird gleich geskipt!',
                });

                flag_quiz_skip_in_process = true;

                try {
                    // useless
                    // await interaction.channel.send({
                    //     content: `${interaction.user.toString()} hat das Flaggenquiz geskipt!`,
                    // });

                    // Delay ?use less?
                    // await new Promise((resolve) => setTimeout(resolve, 4000));

                    let messagesToDelete = await interaction.channel.messages.fetch({ limit: 100 });

                    while (messagesToDelete.size > 0) {
                        await interaction.channel.bulkDelete(messagesToDelete);
                        messagesToDelete = await interaction.channel.messages.fetch({ limit: 100 });
                    }

                    // Reroll (lmao)
                    const randomLanguageCodeKey: string =
                        Object.keys(languageCodes)[Math.floor(Math.random() * Object.keys(languageCodes).length)];
                    const sentMessage = await interaction.channel.send({
                        content: `${interaction.user.toString()} hat Emojiquiz geskippt!`,
                        embeds: [flagQuizPanelEmbed(randomLanguageCodeKey)],
                        components: [flagQuizPanelRow],
                        allowedMentions: { users: [interaction.user.id] },
                    });

                    flagQuizDatabase.set('flag_quiz_data', {
                        languageCode: randomLanguageCodeKey,
                        messageId: sentMessage.id,
                    });
                } catch (error) {
                    console.error('Error 09238402384093849:', error);
                    return interaction.reply({
                        content: 'Es gab einen Fehler beim Überspringen des Quiz.',
                        ephemeral: true,
                    });
                } finally {
                    flag_quiz_skip_in_process = false;
                    flag_quiz_last_global_skip = now + 60000;
                }
            }
            break;

        default:
            interaction.reply({ content: 'error: 53458094580' });
            break;
    }
}
