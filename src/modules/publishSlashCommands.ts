import { ApplicationCommandDataResolvable, ChannelType, Client, SlashCommandBuilder } from 'discord.js';

const slashCommands: ApplicationCommandDataResolvable[] = [
    new SlashCommandBuilder()
        .setName('remind')
        .setDescription('🗒️› Einstellen einer Erinnerungsnachricht.')
        .addStringOption((option) =>
            option
                .setName('zeit')
                .setDescription('⏲️› Wann solltest du erinnert werden? z.b. 2m')
                .setRequired(true)
                .setMinLength(2)
                .setMaxLength(99),
        )
        .addStringOption((option) =>
            option
                .setName('notiz')
                .setDescription('💬› Diese Notiz wird angezeigt, wenn die Zeit vorbei ist.')
                .setRequired(false)
                .setMaxLength(500),
        )
        .addChannelOption((option) =>
            option
                .setName('kanal')
                .setDescription('📰› In welchem Kanal soll es gesendet werden?')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false),
        ),
    new SlashCommandBuilder()
        .setName('coc-account')
        .setDescription('⚔️› Erfahre mehr über eine clash of clans Account.')
        .addStringOption((option) =>
            option
                .setName('tag')
                .setDescription('#️⃣› Was ist der Tag des Account?')
                .setRequired(true)
                .setMinLength(2)
                .setMaxLength(99),
        ),
    new SlashCommandBuilder()
        .setName('random-fact')
        .setDescription('🌟› Dir ist langweilig? Dann lasst dir eine zufällige Fact anzeigen.'),
    new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('👤› Du willst das Profilbild eines Users klauen? Na dann...')
        .addUserOption((option) =>
            option.setName('user').setRequired(false).setDescription('#️⃣› Von wen willst das Profilbild klauen?'),
        ),
];

export const publishSlashCommands = async (client: Client) => {
    await client.application.commands.set(slashCommands, process.env.GUILD_ID).then(() => {
        console.log('Published all Slashcommands... (hoffentlich)');
    });
};
