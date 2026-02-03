const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Muestra ayuda sobre cómo usar el bot de MTG'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x7b5804)
      .setTitle('🃏 Bot de Meta Standard MTG')
      .setDescription('Bot para gestionar mazos del meta de Standard.')
      .addFields(
        {
          name: '⚙️ /setup',
          value: 'Crea la categoría "Standard Meta" con un canal para cada mazo del top 10.',
        },
        {
          name: '📋 /decklist',
          value:
            'Publica una lista de mazo en el canal actual.\n' +
            '**Opciones:** lista, fuente, piloto',
        },
        {
          name: '📊 /meta',
          value: 'Muestra el meta actual con porcentajes.',
        }
      )
      .setFooter({ text: 'Datos de MTGGoldfish - Standard' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
