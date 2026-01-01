"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pipeline = void 0;
class Pipeline {
    stages;
    config;
    logger;
    criticalStages;
    constructor(stages, config, criticalStages = []) {
        this.stages = stages;
        this.config = config;
        this.logger = config.logger;
        this.criticalStages = new Set(criticalStages);
        this.validatePipeline();
    }
    validatePipeline() {
        if (this.stages.length === 0) {
            throw new Error('Pipeline must have at least one stage');
        }
        const stageNames = new Set(this.stages.map(s => s.stageName));
        for (const stage of this.stages) {
            const duplicates = this.stages.filter(s => s.stageName === stage.stageName);
            if (duplicates.length > 1) {
                throw new Error(`Duplicate stage name: '${stage.stageName}'`);
            }
            for (const dep of stage.dependencies || []) {
                if (!stageNames.has(dep)) {
                    throw new Error(`Stage '${stage.stageName}' depends on '${dep}' which is not in the pipeline`);
                }
                const depIndex = this.stages.findIndex(s => s.stageName === dep);
                const stageIndex = this.stages.findIndex(s => s.stageName === stage.stageName);
                if (depIndex >= stageIndex) {
                    throw new Error(`Stage '${stage.stageName}' depends on '${dep}' but '${dep}' comes after it in the pipeline. ` +
                        `Dependencies must come before dependents in stage ordering.`);
                }
            }
        }
        this.logger.info('Pipeline validated successfully', {
            stages: this.stages.map(s => s.stageName),
            criticalStages: Array.from(this.criticalStages),
        });
    }
    createContext(message) {
        return {
            message,
            stageResults: new Map(),
            startedAt: new Date(),
            errors: [],
        };
    }
    async execute(message) {
        const context = this.createContext(message);
        const startTime = Date.now();
        this.logger.info('Pipeline execution started', {
            messageId: message.id,
            channelId: message.channelId,
            userId: message.author.id,
            stageCount: this.stages.length,
        });
        let previousOutput = message;
        try {
            for (const stage of this.stages) {
                this.logger.debug(`Executing stage: ${stage.stageName}`, {
                    messageId: message.id,
                    previousStages: Array.from(context.stageResults.keys()),
                });
                try {
                    const result = await stage.execute(previousOutput, context);
                    context.stageResults.set(stage.stageName, result);
                    previousOutput = result.data;
                    this.logger.debug(`Stage completed: ${stage.stageName}`, {
                        messageId: message.id,
                        executionTime: result.metadata?.['executionTime'],
                    });
                }
                catch (error) {
                    const isCritical = this.criticalStages.has(stage.stageName);
                    this.logger.error(`Stage failed: ${stage.stageName}`, {
                        messageId: message.id,
                        error: error.message,
                        isCritical,
                        stack: error.stack,
                    });
                    if (isCritical || !this.config.continueOnError) {
                        throw new Error(`Critical stage '${stage.stageName}' failed. Pipeline execution stopped.`, { cause: error });
                    }
                }
            }
            const executionTimeMs = Date.now() - startTime;
            this.logger.info('Pipeline execution completed', {
                messageId: message.id,
                executionTimeMs,
                stagesCompleted: context.stageResults.size,
                totalStages: this.stages.length,
                hadErrors: context.errors.length > 0,
            });
            return {
                output: previousOutput,
                stageResults: context.stageResults,
                executionTimeMs,
                success: context.errors.length === 0,
                errors: context.errors,
            };
        }
        catch (error) {
            const executionTimeMs = Date.now() - startTime;
            this.logger.error('Pipeline execution failed', {
                messageId: message.id,
                executionTimeMs,
                error: error.message,
                completedStages: Array.from(context.stageResults.keys()),
                failedStage: context.currentStage,
            });
            return {
                output: previousOutput,
                stageResults: context.stageResults,
                executionTimeMs,
                success: false,
                errors: context.errors,
            };
        }
    }
    getStageNames() {
        return this.stages.map(s => s.stageName);
    }
    hasStage(stageName) {
        return this.stages.some(s => s.stageName === stageName);
    }
    validatePersonaOrdering(personaStage, promptStage) {
        const personaIndex = this.stages.findIndex(s => s.stageName === personaStage);
        const promptIndex = this.stages.findIndex(s => s.stageName === promptStage);
        if (personaIndex === -1) {
            throw new Error(`CRITICAL: Persona selection stage '${personaStage}' is missing from pipeline. ` +
                `Persona selection is MANDATORY for ACE Prime operation.`);
        }
        if (promptIndex === -1) {
            throw new Error(`CRITICAL: Prompt building stage '${promptStage}' is missing from pipeline.`);
        }
        if (personaIndex >= promptIndex) {
            throw new Error(`CRITICAL: Persona selection ('${personaStage}') must occur BEFORE ` +
                `prompt building ('${promptStage}'). Current order violates security requirements. ` +
                `Persona index: ${personaIndex}, Prompt index: ${promptIndex}`);
        }
        this.logger.info('Persona ordering validated', {
            personaStage,
            personaIndex,
            promptStage,
            promptIndex,
        });
    }
}
exports.Pipeline = Pipeline;
//# sourceMappingURL=Pipeline.js.map