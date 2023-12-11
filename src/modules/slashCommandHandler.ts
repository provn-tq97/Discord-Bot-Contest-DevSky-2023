import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    TextChannel,
} from 'discord.js';
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

        case 'coc-account':
            {
                await interaction.deferReply({ ephemeral: true });

                const BASE_URL = 'https://api.clashofclans.com/v1';
                const tag = interaction.options.getString('tag', true);
                let with_kreuz = false;

                if (tag.startsWith('#')) {
                    with_kreuz = true;
                } else if (tag.includes(' ')) {
                    await interaction.editReply({
                        content: `❌ › Der Tag darf keine Leerzeichen beinhalten.`,
                    });

                    return;
                }

                const response = await fetch(
                    `${BASE_URL}/players/${encodeURIComponent(with_kreuz ? tag : `#${tag}`)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.COC_API_KEY}`,
                            Accept: 'application/json',
                        },
                    },
                );
                const data = (await response.json()) as any;

                const embed = new EmbedBuilder()
                    .setColor('#2b2d31')
                    .setTitle(`ℹ️ › Account Infos von ${data.name}`)
                    .setDescription(
                        `🏠 Rathaus-Level: ${data.townHallLevel}\n` +
                            `⭐ Erfahrungslevel: ${data.expLevel}\n` +
                            `🔰 Liga: ${data.league ? data.league.name : 'Keine Liga'}\n` +
                            `🏆 Trophäen: ${data.trophies}\n` +
                            `👑 Höchste Trophäen: ${data.bestTrophies}\n` +
                            `🏅 Kriegssternen: ${data.warStars}\n` +
                            `⚔️ Verteidigungs-Siege: ${data.defenseWins}`,
                    );

                if (!response || response.statusText === 'Not Found' || response.status === 404) {
                    await interaction.editReply({
                        content: `❌ › Der Nutzer mit dem Tag ${
                            with_kreuz ? tag : `#${tag}`
                        } konnte nicht gefunden werden.`,
                    });

                    return;
                }

                await interaction.editReply({ embeds: [embed] });
            }
            break;

        case 'random-fact':
            {
                await interaction.deferReply({ ephemeral: true });

                const API_URL = 'https://api.api-ninjas.com/v1/facts';
                const TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

                const response = await fetch(API_URL, {
                    headers: {
                        'X-Api-Key': process.env.NINJA_API_KEY,
                    },
                });

                const data = (await response.json()) as any;
                const fact = data[0].fact;

                await interaction.editReply({ content: `💡 › ${fact}` });
            }
            break;

        case 'avatar':
            {
                const user = interaction.options.getUser('user', false) || interaction.user;

                const embed = new EmbedBuilder()
                    .setColor('#2b2d31')
                    .setAuthor({
                        name: user.username,
                        iconURL: user.displayAvatarURL({ extension: 'png', size: 4096 }),
                    })
                    .setImage(user.displayAvatarURL({ extension: 'png', size: 4096 }));
                const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('PNG')
                        .setURL(user.displayAvatarURL({ extension: 'png', size: 4096 })),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('WEBP')
                        .setURL(user.displayAvatarURL({ extension: 'webp', size: 4096 })),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('JPG')
                        .setURL(user.displayAvatarURL({ extension: 'jpg', size: 4096 })),
                );

                await interaction.reply({ ephemeral: true, embeds: [embed], components: [row] });
            }
            break;

        default:
            interaction.reply({ content: 'error: 213214' });
            break;
    }
}
