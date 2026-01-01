"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityResolver = void 0;
class IdentityResolver {
    resolveIdentity(message) {
        const author = message.author;
        return Object.freeze({
            id: author.id,
            username: author.username,
            discriminator: author.discriminator,
            displayName: message.member?.displayName ?? author.username,
            isBot: author.bot,
        });
    }
    isValidUser(identity) {
        return !identity.isBot && identity.id.length > 0;
    }
}
exports.IdentityResolver = IdentityResolver;
//# sourceMappingURL=IdentityResolver.js.map