const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { updateMeta } = require('../utils/autoUpdater');
const config = require('../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('actualizar')
    .setDescription('Fuerza una actualización del meta con los torneos recientes')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      await interaction.editReply({
        content: '🔄 Actualizando meta... Esto puede tardar unos minutos.',
      });

      await updateMeta(interaction.client, config.guildId);

      await interaction.followUp({
        content: '✅ Actualización completada. Revisa los canales de Standard Meta.',
      });
    } catch (error) {
      console.error('Error en actualizar:', error);
      await interaction.editReply({
        content: `❌ Error: ${error.message}`,
      });
    }
  },
};
