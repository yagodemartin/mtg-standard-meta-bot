// Debug: mostrar TODAS las variables de entorno
console.log('=== ALL ENV VARS ===');
console.log(JSON.stringify(process.env, null, 2));
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
