const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { getTopDecks, toChannelName } = require('../utils/mtg');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Crea la categoría y canales para los mazos del meta de Standard')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    await interaction.deferReply();

    const guild = interaction.guild;
    const decks = getTopDecks();

    try {
      // Verificar si ya existe la categoría
      let category = guild.channels.cache.find(
        (c) => c.name === 'Standard Meta' && c.type === ChannelType.GuildCategory
      );

      if (!category) {
        // Crear categoría
        category = await guild.channels.create({
          name: 'Standard Meta',
          type: ChannelType.GuildCategory,
        });
      }

      const createdChannels = [];

      // Crear canal para cada mazo
      for (const deck of decks) {
        const channelName = toChannelName(deck.name);

        // Verificar si ya existe
        const existing = guild.channels.cache.find(
          (c) => c.name === channelName && c.parentId === category.id
        );

        if (!existing) {
          const channel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: category.id,
            topic: `${deck.name} - ${deck.percentage} del meta | MTG Standard`,
          });

          // Mensaje inicial
          await channel.send({
            content:
              `# ${deck.name}\n` +
              `📊 **Meta share:** ${deck.percentage}\n\n` +
              `_Usa /decklist para ver la lista actual_`,
          });

          createdChannels.push(channelName);
        }
      }

      if (createdChannels.length > 0) {
        await interaction.editReply({
          content:
            `✅ **Setup completado**\n\n` +
            `📁 Categoría: **Standard Meta**\n` +
            `📝 Canales creados: ${createdChannels.length}\n\n` +
            createdChannels.map((c) => `• #${c}`).join('\n'),
        });
      } else {
        await interaction.editReply({
          content: '⚠️ Todos los canales ya existían.',
        });
      }
    } catch (error) {
      console.error('Error en setup:', error);
      await interaction.editReply({
        content: `❌ Error: ${error.message}`,
      });
    }
  },
};
