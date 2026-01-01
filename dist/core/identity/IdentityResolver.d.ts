import { Message } from 'discord.js';
import { UserIdentity } from '../../types/persona.types';
export declare class IdentityResolver {
    resolveIdentity(message: Message): UserIdentity;
    isValidUser(identity: UserIdentity): boolean;
}
//# sourceMappingURL=IdentityResolver.d.ts.map