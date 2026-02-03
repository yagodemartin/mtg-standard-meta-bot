# MTG Standard Meta Bot - Contexto para Claude

## Qué es este proyecto
Bot de Discord para gestionar mazos del meta de Standard de Magic: The Gathering.
- Extrae datos de MTGGoldfish automáticamente
- Crea canales por arquetipo de mazo
- Publica listas de torneos (Challenges, Leagues)
- Se actualiza cada 6 horas automáticamente

## Datos importantes

### Discord
- **Bot**: Si robo tierra te gano#6750
- **CLIENT_ID**: 1468332919012724818
- **GUILD_ID**: 1181353749730557963
- **LOG_CHANNEL_ID**: 1468341384426553364

### GitHub
- **Repo**: https://github.com/yagodemartin/mtg-standard-meta-bot
- **Usuario**: yagodemartin

### Hosting
- **Plataforma**: Railway.app
- **Deploy**: Automático al hacer `git push`
- **Variables de entorno en Railway**:
  - DISCORD_TOKEN
  - CLIENT_ID
  - GUILD_ID

## Estructura del proyecto
```
src/
├── index.js              # Entrada principal
├── config.js             # Configuración
├── commands/
│   ├── setup.js          # /setup - Crear categoría y canales
│   ├── meta.js           # /meta - Ver meta actual
│   ├── decklist.js       # /decklist - Publicar lista
│   ├── actualizar.js     # /actualizar - Forzar actualización
│   └── help.js           # /help - Ayuda
└── utils/
    ├── autoUpdater.js    # Actualización automática cada 6h
    ├── scraper.js        # Extrae datos de MTGGoldfish
    ├── logger.js         # Logs a canal de Discord
    └── mtg.js            # Datos de mazos del meta
```

## Comandos disponibles
- `/setup` - Crea la categoría "Standard Meta" con canales
- `/meta` - Muestra el top 10 del meta actual
- `/decklist` - Publica una lista manualmente
- `/actualizar` - Fuerza actualización de torneos
- `/help` - Muestra ayuda

## Cómo hacer cambios
1. Editar archivos en `C:\Users\yagod\Documents\discord-compiler-bot`
2. `git add -A && git commit -m "mensaje" && git push`
3. Railway redespliega automáticamente

## Comandos útiles
```bash
# Ir al proyecto
cd C:\Users\yagod\Documents\discord-compiler-bot

# Ver cambios
git status

# Subir cambios
git add -A && git commit -m "descripción" && git push

# Registrar nuevos comandos de Discord
npm run register

# Probar localmente (necesita .env)
npm start
```

## Notas
- El scraper de MTGGoldfish puede fallar si cambian el HTML
- Los torneos procesados se guardan en memoria (se resetean con cada deploy)
- El bot necesita permisos de "Manage Channels" en Discord
