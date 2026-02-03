const { ChannelType } = require('discord.js');
const { getRecentTournaments, getTournamentDecks, getDeckList } = require('./scraper');
const { toChannelName } = require('./mtg');

// Almacena torneos ya procesados para no duplicar
const processedTournaments = new Set();

/**
 * Convierte nombre de arquetipo a nombre de canal
 */
function archetypeToChannel(archetype) {
  return archetype
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 100);
}

/**
 * Busca o crea la categoría Standard Meta
 */
async function getOrCreateCategory(guild) {
  let category = guild.channels.cache.find(
    (c) => c.name === 'Standard Meta' && c.type === ChannelType.GuildCategory
  );

  if (!category) {
    category = await guild.channels.create({
      name: 'Standard Meta',
      type: ChannelType.GuildCategory,
    });
  }

  return category;
}

/**
 * Busca o crea un canal para un arquetipo
 */
async function getOrCreateChannel(guild, category, archetype) {
  const channelName = archetypeToChannel(archetype);

  let channel = guild.channels.cache.find(
    (c) => c.name === channelName && c.parentId === category.id
  );

  if (!channel) {
    channel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: category.id,
      topic: `${archetype} | MTG Standard Meta`,
    });

    console.log(`📝 Canal creado: #${channelName}`);
  }

  return channel;
}

/**
 * Publica resultados de un torneo en los canales correspondientes
 */
async function postTournamentResults(guild, tournament, decks) {
  const category = await getOrCreateCategory(guild);
  const fecha = new Date().toLocaleDateString('es-ES');

  for (const deck of decks) {
    try {
      const channel = await getOrCreateChannel(guild, category, deck.archetype);

      let lista = 'Lista no disponible';
      if (deck.deckUrl) {
        lista = await getDeckList(deck.deckUrl);
      }

      const message =
        `## 🏆 ${tournament.name}\n` +
        `**Posición:** #${deck.position}\n` +
        `**Arquetipo:** ${deck.archetype}\n` +
        `**Fecha:** ${fecha}\n` +
        `**Fuente:** [MTGGoldfish](${tournament.url})\n\n` +
        `\`\`\`\n${lista.substring(0, 1800)}\n\`\`\``;

      await channel.send({ content: message });

      // Pequeña pausa para no saturar la API
      await new Promise((r) => setTimeout(r, 1000));
    } catch (error) {
      console.error(`Error posting deck ${deck.archetype}:`, error.message);
    }
  }
}

/**
 * Actualiza el meta con los torneos más recientes
 */
async function updateMeta(client, guildId) {
  console.log('🔄 Iniciando actualización del meta...');

  try {
    const guild = await client.guilds.fetch(guildId);
    const tournaments = await getRecentTournaments();

    console.log(`📊 Encontrados ${tournaments.length} torneos`);

    let updated = 0;

    for (const tournament of tournaments) {
      // Saltar si ya procesamos este torneo
      if (processedTournaments.has(tournament.url)) {
        continue;
      }

      console.log(`📋 Procesando: ${tournament.name}`);

      const decks = await getTournamentDecks(tournament.url);

      if (decks.length > 0) {
        await postTournamentResults(guild, tournament, decks);
        processedTournaments.add(tournament.url);
        updated++;

        // Limitar a 3 torneos por actualización
        if (updated >= 3) break;
      }

      // Pausa entre torneos
      await new Promise((r) => setTimeout(r, 2000));
    }

    console.log(`✅ Actualización completada. ${updated} torneos procesados.`);
  } catch (error) {
    console.error('❌ Error en actualización:', error.message);
  }
}

/**
 * Inicia el actualizador automático
 */
function startAutoUpdater(client, guildId, intervalHours = 6) {
  const intervalMs = intervalHours * 60 * 60 * 1000;

  console.log(`⏰ Auto-updater iniciado. Intervalo: ${intervalHours} horas`);

  // Primera actualización después de 1 minuto
  setTimeout(() => {
    updateMeta(client, guildId);
  }, 60000);

  // Actualizaciones periódicas
  setInterval(() => {
    updateMeta(client, guildId);
  }, intervalMs);
}

module.exports = {
  updateMeta,
  startAutoUpdater,
};
