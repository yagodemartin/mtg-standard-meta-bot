// Solo cargar dotenv si existe el archivo .env (desarrollo local)
try {
  require('dotenv').config();
} catch (e) {
  // En Railway no hay .env, las variables vienen del entorno
}

// Debug: mostrar qué variables hay
console.log('=== DEBUG CONFIG ===');
console.log('DISCORD_TOKEN exists:', !!process.env.DISCORD_TOKEN);
console.log('CLIENT_ID:', process.env.CLIENT_ID);
console.log('GUILD_ID:', process.env.GUILD_ID);
console.log('====================');

module.exports = {
  // Discord configuration
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  allowedRoleId: process.env.ALLOWED_ROLE_ID,
  logChannelId: process.env.LOG_CHANNEL_ID || '1468341384426553364',

  // Execution limits
  timeoutMs: parseInt(process.env.TIMEOUT_MS) || 10000,
  maxOutputLength: 1900,
};
