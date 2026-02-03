const https = require('https');

/**
 * Hace una petición HTTPS y devuelve el HTML
 */
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Extrae torneos recientes de MTGGoldfish
 */
async function getRecentTournaments() {
  try {
    const html = await fetchPage('https://www.mtggoldfish.com/tournament_searches/create?utf8=%E2%9C%93&tournament_search%5Bformat%5D=standard&tournament_search%5Bdate_range%5D=01%2F01%2F2024+-+12%2F31%2F2026&commit=Search');

    const tournaments = [];
    // Buscar enlaces de torneos
    const regex = /href="(\/tournament\/[^"]+)"[^>]*>([^<]+)</g;
    let match;

    while ((match = regex.exec(html)) !== null && tournaments.length < 10) {
      const url = 'https://www.mtggoldfish.com' + match[1];
      const name = match[2].trim();
      if (name && !name.includes('undefined')) {
        tournaments.push({ name, url });
      }
    }

    return tournaments;
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return [];
  }
}

/**
 * Extrae los top decks de un torneo
 */
async function getTournamentDecks(tournamentUrl) {
  try {
    const html = await fetchPage(tournamentUrl);
    const decks = [];

    // Buscar mazos y sus posiciones
    const deckRegex = /class="tournament-decklist"[\s\S]*?href="(\/archetype\/[^"]+)"[^>]*>([^<]+)<[\s\S]*?href="(\/deck\/[^"]+)"/g;
    let match;
    let position = 1;

    while ((match = deckRegex.exec(html)) !== null && position <= 4) {
      decks.push({
        position,
        archetype: match[2].trim(),
        deckUrl: 'https://www.mtggoldfish.com' + match[3],
      });
      position++;
    }

    // Método alternativo si el anterior no funciona
    if (decks.length === 0) {
      const altRegex = /deck-tile-description[\s\S]*?href="[^"]*\/archetype\/([^"]+)"[^>]*>([^<]+)</g;
      while ((match = altRegex.exec(html)) !== null && decks.length < 4) {
        decks.push({
          position: decks.length + 1,
          archetype: match[2].trim(),
          deckUrl: null,
        });
      }
    }

    return decks;
  } catch (error) {
    console.error('Error fetching tournament decks:', error);
    return [];
  }
}

/**
 * Extrae la lista de cartas de un mazo
 */
async function getDeckList(deckUrl) {
  try {
    const html = await fetchPage(deckUrl);

    // Extraer lista en formato texto
    const listMatch = html.match(/class="deck-view-decklist"[\s\S]*?<textarea[^>]*>([\s\S]*?)<\/textarea>/);
    if (listMatch) {
      return listMatch[1].trim();
    }

    // Método alternativo: extraer cartas individuales
    let deckList = '';
    const cardRegex = /data-card-id="[^"]*"[\s\S]*?class="deck-col-qty"[^>]*>(\d+)<[\s\S]*?class="deck-col-card"[^>]*>[\s\S]*?>([^<]+)</g;
    let match;

    while ((match = cardRegex.exec(html)) !== null) {
      deckList += `${match[1]} ${match[2].trim()}\n`;
    }

    return deckList || 'No se pudo extraer la lista';
  } catch (error) {
    console.error('Error fetching deck list:', error);
    return 'Error al obtener la lista';
  }
}

module.exports = {
  getRecentTournaments,
  getTournamentDecks,
  getDeckList,
  fetchPage,
};
