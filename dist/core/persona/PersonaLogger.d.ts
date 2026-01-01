import { PersonaSelection } from '../../types/persona.types';
import { Logger } from '../../utils/logger';
export declare class PersonaLogger {
    private readonly logger;
    constructor(logger: Logger);
    logSelection(selection: PersonaSelection): void;
    logError(error: Error, userId: string, messageId: string): void;
}
//# sourceMappingURL=PersonaLogger.d.ts.map