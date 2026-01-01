"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHandler = void 0;
const IdentityResolver_1 = require("../core/identity/IdentityResolver");
const OwnerValidator_1 = require("../core/identity/OwnerValidator");
const PersonaSelector_1 = require("../core/persona/PersonaSelector");
const PersonaLogger_1 = require("../core/persona/PersonaLogger");
const AIAvailabilityChecker_1 = require("../services/ai/AIAvailabilityChecker");
const FALLBACK_MESSAGE = 'ACE Prime is online. AI responses are currently disabled.';
class MessageHandler {
    personaSelector;
    logger;
    isOpenAIAvailable;
    constructor(logger) {
        this.logger = logger;
        const identityResolver = new IdentityResolver_1.IdentityResolver();
        const ownerValidator = new OwnerValidator_1.OwnerValidator();
        const personaLogger = new PersonaLogger_1.PersonaLogger(logger);
        this.personaSelector = new PersonaSelector_1.PersonaSelector(identityResolver, ownerValidator, personaLogger);
        this.isOpenAIAvailable = AIAvailabilityChecker_1.AIAvailabilityChecker.isOpenAIAvailable();
        if (!this.isOpenAIAvailable) {
            this.logger.warn('OpenAI API key not configured. Bot will run in fallback mode.', {
                message: 'Set OPENAI_API_KEY environment variable to enable AI responses',
            });
        }
        else {
            this.logger.info('OpenAI API key detected. AI responses enabled.');
        }
    }
    async handleMessage(message) {
        try {
            if (message.author.bot) {
                return;
            }
            this.logger.debug('Processing message', {
                messageId: message.id,
                userId: message.author.id,
                channelId: message.channelId,
            });
            let personaSelection;
            try {
                personaSelection = this.personaSelector.selectPersona(message);
                this.logger.debug('Persona selection completed', {
                    persona: personaSelection.persona,
                    isOwner: personaSelection.isOwner,
                });
            }
            catch (error) {
                this.logger.error('Persona selection failed', {
                    error: error.message,
                    messageId: message.id,
                });
                return;
            }
            if (!this.isOpenAIAvailable) {
                await this.sendFallbackResponse(message);
                return;
            }
            this.logger.debug('OpenAI available, but AI pipeline not yet implemented', {
                messageId: message.id,
            });
        }
        catch (error) {
            this.logger.error('Message handling failed', {
                error: error.message,
                stack: error.stack,
                messageId: message.id,
            });
        }
    }
    async sendFallbackResponse(message) {
        try {
            await message.reply(FALLBACK_MESSAGE);
            this.logger.debug('Fallback message sent', {
                messageId: message.id,
                channelId: message.channelId,
            });
        }
        catch (error) {
            this.logger.error('Failed to send fallback message', {
                error: error.message,
                messageId: message.id,
            });
        }
    }
}
exports.MessageHandler = MessageHandler;
//# sourceMappingURL=MessageHandler.js.map