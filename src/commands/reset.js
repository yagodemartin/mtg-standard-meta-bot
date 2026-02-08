const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { log } = require('../utils/logger');
const { clearProcessedTournaments } = require('../utils/autoUpdater');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reset')
    .setDescription('Borra todos los canales de Standard Meta y reinicia el sistema')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    await interaction.deferReply();

    const guild = interaction.guild;

    try {
      // Buscar la categoría Standard Meta
      const category = guild.channels.cache.find(
        (c) => c.name === 'Standard Meta' && c.type === ChannelType.GuildCategory
      );

      if (!category) {
        await interaction.editReply({
          content: '⚠️ No existe la categoría "Standard Meta".',
        });
        return;
      }

      // Obtener todos los canales de la categoría
      const channels = guild.channels.cache.filter(
        (c) => c.parentId === category.id && c.type === ChannelType.GuildText
      );

      let deleted = 0;

      for (const [, channel] of channels) {
        await channel.delete('Reset de Standard Meta');
        deleted++;
        await new Promise((r) => setTimeout(r, 500)); // Pausa para no saturar la API
      }

      // Limpiar torneos procesados para que se puedan reprocesar
      clearProcessedTournaments();

      await log(`Reset completado: ${deleted} canales borrados`, 'success');

      await interaction.editReply({
        content:
          `✅ **Reset completado**\n\n` +
          `🗑️ Canales borrados: ${deleted}\n\n` +
          `Usa \`/actualizar\` para volver a poblar los canales con los torneos recientes.`,
      });
    } catch (error) {
      console.error('Error en reset:', error);
      await interaction.editReply({
        content: `❌ Error: ${error.message}`,
      });
    }
  },
};
