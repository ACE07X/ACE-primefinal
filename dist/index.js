"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const MessageHandler_1 = require("./events/MessageHandler");
const logger_1 = require("./utils/logger");
const constants_1 = require("./config/constants");
dotenv_1.default.config();
async function main() {
    const logger = new logger_1.ConsoleLogger();
    logger.info('Starting ACE Prime...', {
        version: constants_1.SYSTEM_CONSTANTS.VERSION,
        botName: constants_1.SYSTEM_CONSTANTS.BOT_NAME,
    });
    const discordToken = process.env['DISCORD_TOKEN'];
    if (!discordToken || discordToken.trim().length === 0) {
        console.error('DISCORD_TOKEN is not set. Bot cannot start.');
        process.exit(1);
    }
    const client = new discord_js_1.Client({
        intents: [
            discord_js_1.GatewayIntentBits.Guilds,
            discord_js_1.GatewayIntentBits.GuildMessages,
            discord_js_1.GatewayIntentBits.MessageContent,
        ],
    });
    const messageHandler = new MessageHandler_1.MessageHandler(logger);
    client.once('ready', () => {
        logger.info('ACE Prime is online and ready!', {
            botName: client.user?.tag,
            botId: client.user?.id,
            guildCount: client.guilds.cache.size,
        });
    });
    client.on('messageCreate', async (message) => {
        await messageHandler.handleMessage(message);
    });
    client.on('error', (error) => {
        logger.error('Discord client error', {
            error: error.message,
            stack: error.stack,
        });
    });
    process.on('SIGINT', () => {
        logger.info('Shutting down ACE Prime...');
        client.destroy();
        process.exit(0);
    });
    process.on('SIGTERM', () => {
        logger.info('Shutting down ACE Prime...');
        client.destroy();
        process.exit(0);
    });
    try {
        await client.login(discordToken);
    }
    catch (error) {
        logger.error('Failed to login to Discord', {
            error: error.message,
            stack: error.stack,
        });
        process.exit(1);
    }
}
main().catch((error) => {
    console.error('Fatal error starting ACE Prime:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map