const https = require('https');

const TOP_DECKS = [
  { name: 'Simic Ouroboroid', percentage: '14.7%', slug: 'simic-ouroboroid' },
  { name: 'Izzet Lessons', percentage: '13.1%', slug: 'izzet-lessons' },
  { name: 'Dimir Midrange', percentage: '8.5%', slug: 'dimir-midrange' },
  { name: 'Jeskai Control', percentage: '8.2%', slug: 'jeskai-control' },
  { name: 'Mono-Red Aggro', percentage: '5.0%', slug: 'mono-red-aggro' },
  { name: 'Sultai Reanimator', percentage: '4.2%', slug: 'sultai-reanimator' },
  { name: 'Selesnya Landfall', percentage: '3.6%', slug: 'selesnya-landfall' },
  { name: 'Bant Airbending Combo', percentage: '3.4%', slug: 'bant-airbending-combo' },
  { name: 'Boros Aggro', percentage: '2.7%', slug: 'boros-aggro' },
  { name: '4c Reanimator', percentage: '2.7%', slug: '4c-reanimator' },
];

/**
 * Convierte nombre de mazo a nombre de canal válido para Discord
 */
function toChannelName(deckName) {
  return deckName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 100);
}

/**
 * Obtiene la lista de mazos del meta
 */
function getTopDecks() {
  return TOP_DECKS;
}

/**
 * Actualiza un mazo en la lista
 */
function updateDeck(index, name, percentage) {
  if (index >= 0 && index < TOP_DECKS.length) {
    TOP_DECKS[index] = {
      name,
      percentage,
      slug: toChannelName(name),
    };
    return true;
  }
  return false;
}

module.exports = {
  getTopDecks,
  updateDeck,
  toChannelName,
};
