"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineStage = void 0;
class PipelineStage {
    stageName;
    dependencies;
    constructor(stageName, dependencies = []) {
        this.stageName = stageName;
        this.dependencies = dependencies;
    }
    validateDependencies(context) {
        for (const dependency of this.dependencies) {
            if (!context.stageResults.has(dependency)) {
                throw new Error(`Stage '${this.stageName}' requires '${dependency}' to complete first. ` +
                    `Current stages: [${Array.from(context.stageResults.keys()).join(', ')}]`);
            }
        }
    }
    getStageResult(context, stageName) {
        const result = context.stageResults.get(stageName);
        if (!result) {
            throw new Error(`Stage '${this.stageName}' attempted to access result from '${stageName}' ` +
                `but that stage has not completed.`);
        }
        return result.data;
    }
    async execute(input, context) {
        this.validateDependencies(context);
        context.currentStage = this.stageName;
        try {
            const data = await this.executeStage(input, context);
            const result = {
                data,
                stageName: this.stageName,
                completedAt: new Date(),
                metadata: {
                    executionTime: Date.now() - context.startedAt.getTime(),
                },
            };
            return result;
        }
        catch (error) {
            context.errors.push({
                stage: this.stageName,
                error: error,
            });
            throw new Error(`Stage '${this.stageName}' failed: ${error.message}`, { cause: error });
        }
    }
}
exports.PipelineStage = PipelineStage;
//# sourceMappingURL=PipelineStage.js.map