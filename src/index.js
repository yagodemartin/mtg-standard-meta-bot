const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const { startAutoUpdater } = require('./utils/autoUpdater');

// Verificar configuración
if (!config.token) {
  console.error('❌ Error: DISCORD_TOKEN no está configurado');
  process.exit(1);
}

if (!config.clientId) {
  console.error('❌ Error: CLIENT_ID no está configurado');
  process.exit(1);
}

// Crear cliente de Discord
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Colección para almacenar comandos
client.commands = new Collection();

// Cargar comandos
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    console.log(`✓ Comando cargado: ${command.data.name}`);
  }
}

// Evento: Bot listo
client.once('ready', (c) => {
  console.log('═══════════════════════════════════════');
  console.log(`✅ Bot conectado como ${c.user.tag}`);
  console.log(`📊 Servidores: ${c.guilds.cache.size}`);
  console.log('═══════════════════════════════════════');

  // Iniciar actualizador automático (cada 6 horas)
  if (config.guildId) {
    startAutoUpdater(client, config.guildId, 6);
  }
});

// Evento: Interacción recibida
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`Comando no encontrado: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error ejecutando ${interaction.commandName}:`, error);

    const errorMessage = {
      content: '❌ Hubo un error al ejecutar este comando.',
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

// Manejar errores
process.on('unhandledRejection', (error) => {
  console.error('Error no manejado:', error);
});

// Iniciar bot
client.login(config.token);
