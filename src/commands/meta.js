const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getTopDecks } = require('../utils/mtg');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meta')
    .setDescription('Muestra los mazos del meta actual de Standard'),

  async execute(interaction) {
    const decks = getTopDecks();

    const deckList = decks
      .map((deck, i) => `**${i + 1}.** ${deck.name} - \`${deck.percentage}\``)
      .join('\n');

    const embed = new EmbedBuilder()
      .setColor(0x7b5804)
      .setTitle('📊 Meta de Standard')
      .setDescription(deckList)
      .setFooter({ text: 'Fuente: MTGGoldfish' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
