const { REST, Routes } = require('discord.js');
const config = require('./config');
const fs = require('fs');
const path = require('path');

// Cargar todos los comandos
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
    console.log(`Cargado comando: ${command.data.name}`);
  }
}

// Registrar comandos
const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
  try {
    console.log(`Registrando ${commands.length} comandos...`);

    // Registrar para un servidor específico (más rápido para desarrollo)
    if (config.guildId) {
      const data = await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: commands }
      );
      console.log(`✅ Registrados ${data.length} comandos en el servidor.`);
    } else {
      // Registrar globalmente (puede tardar hasta 1 hora en propagarse)
      const data = await rest.put(Routes.applicationCommands(config.clientId), {
        body: commands,
      });
      console.log(`✅ Registrados ${data.length} comandos globalmente.`);
    }
  } catch (error) {
    console.error('Error al registrar comandos:', error);
  }
})();
