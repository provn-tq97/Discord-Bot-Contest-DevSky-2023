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
];

export const publishSlashCommands = async (client: Client) => {
    await client.application.commands.set(slashCommands, process.env.GUILD_ID).then(() => {
        console.log('Published all Slashcommands... (hoffentlich)');
    });
};
