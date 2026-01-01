"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonaSelector = void 0;
const persona_types_1 = require("../../types/persona.types");
class PersonaSelector {
    identityResolver;
    ownerValidator;
    logger;
    constructor(identityResolver, ownerValidator, logger) {
        this.identityResolver = identityResolver;
        this.ownerValidator = ownerValidator;
        this.logger = logger;
    }
    selectPersona(message) {
        try {
            const identity = this.identityResolver.resolveIdentity(message);
            if (!this.identityResolver.isValidUser(identity)) {
                throw new Error('Cannot select persona for bot user');
            }
            const isOwner = this.ownerValidator.isOwner(identity);
            const persona = isOwner ? persona_types_1.PersonaType.BUTLER : persona_types_1.PersonaType.SUPERVISOR;
            const selection = Object.freeze({
                persona,
                userId: identity.id,
                username: identity.username,
                isOwner,
                timestamp: new Date(),
                messageId: message.id,
                channelId: message.channelId,
            });
            this.logger.logSelection(selection);
            return selection;
        }
        catch (error) {
            this.logger.logError(error, message.author.id, message.id);
            throw error;
        }
    }
    getPersonaType(message) {
        const identity = this.identityResolver.resolveIdentity(message);
        const isOwner = this.ownerValidator.isOwner(identity);
        return isOwner ? persona_types_1.PersonaType.BUTLER : persona_types_1.PersonaType.SUPERVISOR;
    }
}
exports.PersonaSelector = PersonaSelector;
//# sourceMappingURL=PersonaSelector.js.map