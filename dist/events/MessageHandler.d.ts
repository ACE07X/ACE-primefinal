import { Message } from 'discord.js';
import { Logger } from '../utils/logger';
export declare class MessageHandler {
    private readonly personaSelector;
    private readonly logger;
    private readonly isOpenAIAvailable;
    constructor(logger: Logger);
    handleMessage(message: Message): Promise<void>;
    private sendFallbackResponse;
}
//# sourceMappingURL=MessageHandler.d.ts.map