const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('decklist')
    .setDescription('Publica o actualiza una lista de mazo en el canal actual')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option
        .setName('lista')
        .setDescription('La lista del mazo (formato texto)')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('fuente')
        .setDescription('URL o fuente de la lista (ej: MTGGoldfish)')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('piloto')
        .setDescription('Nombre del jugador/piloto')
        .setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const lista = interaction.options.getString('lista');
    const fuente = interaction.options.getString('fuente') || 'No especificada';
    const piloto = interaction.options.getString('piloto') || 'Desconocido';
    const fecha = new Date().toLocaleDateString('es-ES');

    try {
      const message =
        `## 📋 Lista Actualizada\n` +
        `👤 **Piloto:** ${piloto}\n` +
        `🔗 **Fuente:** ${fuente}\n` +
        `📅 **Fecha:** ${fecha}\n\n` +
        `\`\`\`\n${lista}\n\`\`\``;

      await interaction.editReply({ content: message });
    } catch (error) {
      console.error('Error en decklist:', error);
      await interaction.editReply({
        content: `❌ Error: ${error.message}`,
      });
    }
  },
};
