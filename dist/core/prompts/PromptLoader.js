"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptLoader = exports.PromptType = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
const PromptValidator_1 = require("./PromptValidator");
var PromptType;
(function (PromptType) {
    PromptType["BUTLER_SYSTEM"] = "butler.system.md";
    PromptType["SUPERVISOR_SYSTEM"] = "supervisor.system.md";
    PromptType["DEVELOPER"] = "developer.md";
})(PromptType || (exports.PromptType = PromptType = {}));
class PromptLoader {
    config;
    logger;
    cache;
    validated;
    constructor(config) {
        this.config = {
            promptsDirectory: config.promptsDirectory || path.join(process.cwd(), 'prompts'),
            enableHotReload: config.enableHotReload ?? process.env['NODE_ENV'] === 'development',
            logger: config.logger,
        };
        this.logger = config.logger;
        this.cache = new Map();
        this.validated = new Set();
        this.logger.info('PromptLoader initialized', {
            promptsDirectory: this.config.promptsDirectory,
            enableHotReload: this.config.enableHotReload,
        });
    }
    getPromptPath(promptType) {
        return path.join(this.config.promptsDirectory, promptType);
    }
    loadFromDisk(promptType) {
        const filePath = this.getPromptPath(promptType);
        this.logger.debug(`Loading prompt from disk: ${promptType}`, { filePath });
        if (!fs.existsSync(filePath)) {
            throw new Error(`Prompt file not found: ${promptType}. ` +
                `Expected at: ${filePath}. ` +
                `Ensure prompt files are present in the prompts directory.`);
        }
        let content;
        try {
            content = fs.readFileSync(filePath, 'utf-8');
        }
        catch (error) {
            throw new Error(`Failed to read prompt file: ${promptType}. ` +
                `Path: ${filePath}. ` +
                `Error: ${error.message}`, { cause: error });
        }
        this.logger.debug(`Prompt loaded from disk: ${promptType}`, {
            filePath,
            contentLength: content.length,
        });
        return content;
    }
    validatePrompt(promptText, promptType) {
        try {
            PromptValidator_1.PromptValidator.validate(promptText, promptType);
            PromptValidator_1.PromptValidator.validateMinLength(promptText, promptType, 10);
            PromptValidator_1.PromptValidator.validateMaxLength(promptText, promptType, 10000);
            this.logger.debug(`Prompt validated: ${promptType}`);
        }
        catch (error) {
            this.logger.error(`Prompt validation failed: ${promptType}`, {
                error: error.message,
            });
            throw error;
        }
    }
    load(promptType) {
        if (this.config.enableHotReload) {
            this.logger.debug(`Hot-reload enabled, loading from disk: ${promptType}`);
            const content = this.loadFromDisk(promptType);
            this.validatePrompt(content, promptType);
            return content;
        }
        const cached = this.cache.get(promptType);
        if (cached !== undefined) {
            this.logger.debug(`Returning cached prompt: ${promptType}`);
            return cached;
        }
        const content = this.loadFromDisk(promptType);
        if (!this.validated.has(promptType)) {
            this.validatePrompt(content, promptType);
            this.validated.add(promptType);
        }
        this.cache.set(promptType, content);
        this.logger.info(`Prompt loaded and cached: ${promptType}`, {
            contentLength: content.length,
        });
        return content;
    }
    preloadAll() {
        this.logger.info('Preloading all prompts...');
        const promptTypes = Object.values(PromptType);
        const results = [];
        for (const promptType of promptTypes) {
            try {
                this.load(promptType);
                results.push({ type: promptType, success: true });
            }
            catch (error) {
                const errorMessage = error.message;
                results.push({ type: promptType, success: false, error: errorMessage });
                this.logger.error(`Failed to preload prompt: ${promptType}`, {
                    error: errorMessage,
                });
            }
        }
        const successCount = results.filter(r => r.success).length;
        const failureCount = results.filter(r => !r.success).length;
        if (failureCount > 0) {
            const failedPrompts = results
                .filter(r => !r.success)
                .map(r => `${r.type}: ${r.error}`)
                .join('; ');
            throw new Error(`Failed to preload ${failureCount} prompt(s): ${failedPrompts}`);
        }
        this.logger.info('All prompts preloaded successfully', {
            count: successCount,
            prompts: promptTypes,
        });
    }
    clearCache() {
        const cacheSize = this.cache.size;
        this.cache.clear();
        this.validated.clear();
        this.logger.info('Prompt cache cleared', {
            clearedEntries: cacheSize,
        });
    }
    getCacheStats() {
        return {
            size: this.cache.size,
            hotReloadEnabled: this.config.enableHotReload,
            cachedPrompts: Array.from(this.cache.keys()),
        };
    }
    isCached(promptType) {
        return this.cache.has(promptType);
    }
}
exports.PromptLoader = PromptLoader;
//# sourceMappingURL=PromptLoader.js.map