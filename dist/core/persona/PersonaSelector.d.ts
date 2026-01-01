import { Message } from 'discord.js';
import { IdentityResolver } from '../identity/IdentityResolver';
import { OwnerValidator } from '../identity/OwnerValidator';
import { PersonaLogger } from './PersonaLogger';
import { PersonaType, PersonaSelection } from '../../types/persona.types';
export declare class PersonaSelector {
    private readonly identityResolver;
    private readonly ownerValidator;
    private readonly logger;
    constructor(identityResolver: IdentityResolver, ownerValidator: OwnerValidator, logger: PersonaLogger);
    selectPersona(message: Message): PersonaSelection;
    getPersonaType(message: Message): PersonaType;
}
//# sourceMappingURL=PersonaSelector.d.ts.map