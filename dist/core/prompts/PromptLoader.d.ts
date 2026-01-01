import { Logger } from '../../utils/logger';
export interface PromptLoaderConfig {
    promptsDirectory?: string;
    enableHotReload?: boolean;
    logger: Logger;
}
export declare enum PromptType {
    BUTLER_SYSTEM = "butler.system.md",
    SUPERVISOR_SYSTEM = "supervisor.system.md",
    DEVELOPER = "developer.md"
}
export declare class PromptLoader {
    private readonly config;
    private readonly logger;
    private readonly cache;
    private readonly validated;
    constructor(config: PromptLoaderConfig);
    private getPromptPath;
    private loadFromDisk;
    private validatePrompt;
    load(promptType: PromptType): string;
    preloadAll(): void;
    clearCache(): void;
    getCacheStats(): {
        size: number;
        hotReloadEnabled: boolean;
        cachedPrompts: PromptType[];
    };
    isCached(promptType: PromptType): boolean;
}
//# sourceMappingURL=PromptLoader.d.ts.map