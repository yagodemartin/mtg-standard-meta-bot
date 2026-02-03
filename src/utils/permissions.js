const config = require('../config');

/**
 * Verifica si el usuario tiene el rol permitido para usar los comandos
 * @param {import('discord.js').GuildMember} member - Miembro del servidor
 * @returns {boolean} - true si tiene permiso
 */
function hasPermission(member) {
  if (!config.allowedRoleId) {
    // Si no hay rol configurado, permitir a todos
    return true;
  }

  return member.roles.cache.has(config.allowedRoleId);
}

/**
 * Middleware para verificar permisos antes de ejecutar un comando
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @returns {boolean} - true si puede continuar, false si fue rechazado
 */
async function checkPermission(interaction) {
  if (!interaction.member) {
    await interaction.reply({
      content: '❌ Este comando solo puede usarse en un servidor.',
      ephemeral: true,
    });
    return false;
  }

  if (!hasPermission(interaction.member)) {
    await interaction.reply({
      content: '❌ No tienes permiso para usar este comando. Necesitas el rol autorizado.',
      ephemeral: true,
    });

    // Log para auditoría
    console.log(`[DENIED] Usuario ${interaction.user.tag} intentó usar ${interaction.commandName}`);
    return false;
  }

  // Log de uso autorizado
  console.log(`[ALLOWED] Usuario ${interaction.user.tag} ejecutando ${interaction.commandName}`);
  return true;
}

module.exports = {
  hasPermission,
  checkPermission,
};
