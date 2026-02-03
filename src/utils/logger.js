const config = require('../config');

let logChannel = null;

/**
 * Inicializa el logger con el cliente de Discord
 */
async function initLogger(client) {
  try {
    logChannel = await client.channels.fetch(config.logChannelId);
    console.log(`📋 Logger conectado al canal #${logChannel.name}`);
  } catch (error) {
    console.error('Error conectando al canal de logs:', error.message);
  }
}

/**
 * Envía un mensaje al canal de logs
 */
async function log(message, type = 'info') {
  const timestamp = new Date().toLocaleString('es-ES');
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    update: '🔄',
    tournament: '🏆',
  };

  const icon = icons[type] || 'ℹ️';
  const formatted = `${icon} \`[${timestamp}]\` ${message}`;

  // Log a consola siempre
  console.log(`[${type.toUpperCase()}] ${message}`);

  // Log a Discord si está disponible
  if (logChannel) {
    try {
      await logChannel.send(formatted);
    } catch (error) {
      console.error('Error enviando log a Discord:', error.message);
    }
  }
}

module.exports = {
  initLogger,
  log,
};
