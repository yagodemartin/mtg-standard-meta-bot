require('dotenv').config();

module.exports = {
  // Discord configuration
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  allowedRoleId: process.env.ALLOWED_ROLE_ID,

  // Execution limits
  timeoutMs: parseInt(process.env.TIMEOUT_MS) || 10000,
  maxOutputLength: 1900, // Discord limit is 2000, leave room for formatting

  // Paths
  tempDir: __dirname + '/temp',

  // Supported languages
  languages: {
    c: {
      extension: '.c',
      compiler: 'gcc',
      flags: ['-o'],
    },
    cpp: {
      extension: '.cpp',
      compiler: 'g++',
      flags: ['-o'],
    },
    'c++': {
      extension: '.cpp',
      compiler: 'g++',
      flags: ['-o'],
    },
  },
};
