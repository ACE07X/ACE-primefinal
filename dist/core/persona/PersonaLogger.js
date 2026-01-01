"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonaLogger = void 0;
class PersonaLogger {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    logSelection(selection) {
        this.logger.info('Persona selected', {
            persona: selection.persona,
            userId: selection.userId,
            username: selection.username,
            isOwner: selection.isOwner,
            messageId: selection.messageId,
            channelId: selection.channelId,
            timestamp: selection.timestamp.toISOString(),
        });
    }
    logError(error, userId, messageId) {
        this.logger.error('Persona selection error', {
            error: error.message,
            stack: error.stack,
            userId,
            messageId,
        });
    }
}
exports.PersonaLogger = PersonaLogger;
//# sourceMappingURL=PersonaLogger.js.map