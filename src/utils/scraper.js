const https = require('https');

/**
 * Hace una petición HTTPS y devuelve el HTML (sigue redirects)
 */
function fetchPage(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) {
      return reject(new Error('Too many redirects'));
    }

    https.get(url, (res) => {
      // Seguir redirects 301/302
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          return resolve(fetchPage(redirectUrl, maxRedirects - 1));
        }
      }

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

    // Buscar mazos en la tabla de resultados del torneo
    // Estructura: <tr class='tournament-decklist-odd/even'>...<a href="/deck/123">Archetype Name</a>
    const deckRegex = /tournament-decklist-(?:odd|even)[\s\S]*?<a\s+href="(\/deck\/\d+)">([^<]+)<\/a>/g;
    let match;
    let position = 1;

    while ((match = deckRegex.exec(html)) !== null && position <= 8) {
      decks.push({
        position,
        archetype: match[2].trim(),
        deckUrl: 'https://www.mtggoldfish.com' + match[1],
      });
      position++;
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

    // Método 1: Extraer del input hidden deck_input[deck]
    const inputMatch = html.match(/name="deck_input\[deck\]"[^>]*value="([^"]+)"/);
    if (inputMatch) {
      // Decodificar entidades HTML
      return inputMatch[1]
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim();
    }

    // Método 2: Extraer cartas individuales de la tabla
    let deckList = '';
    const cardRegex = /deck-col-qty[^>]*>(\d+)<[\s\S]*?deck-col-card[^>]*>[\s\S]*?data-card-name="([^"]+)"/g;
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

/**
 * Obtiene screenshot del mazo visual usando Microlink
 */
async function getDeckVisualScreenshot(deckId) {
  try {
    const visualUrl = `https://www.mtggoldfish.com/deck/visual/${deckId}`;
    const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(visualUrl)}&screenshot=true&screenshot.fullPage=true&viewport.width=1200&viewport.height=2000&waitForTimeout=5000`;

    const response = await fetchPage(apiUrl);
    const data = JSON.parse(response);

    if (data.status === 'success' && data.data?.screenshot?.url) {
      return data.data.screenshot.url;
    }

    return null;
  } catch (error) {
    console.error('Error getting deck screenshot:', error);
    return null;
  }
}

/**
 * Obtiene la imagen de preview de un mazo (carta principal)
 */
async function getDeckImage(deckId) {
  try {
    const html = await fetchPage(`https://www.mtggoldfish.com/deck/visual/${deckId}`);

    // Buscar og:image
    const ogMatch = html.match(/og:image[^>]*content="([^"]+)"/);
    if (ogMatch) {
      return ogMatch[1];
    }

    return null;
  } catch (error) {
    return null;
  }
}

module.exports = {
  getRecentTournaments,
  getTournamentDecks,
  getDeckList,
  getDeckImage,
  getDeckVisualScreenshot,
  fetchPage,
};
