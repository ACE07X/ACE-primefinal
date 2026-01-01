"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineBuilder = void 0;
const Pipeline_1 = require("./Pipeline");
class PipelineBuilder {
    stages = [];
    criticalStages = [];
    config = {};
    addStage(stage) {
        this.stages.push(stage);
        return this;
    }
    markCritical(stageName) {
        this.criticalStages.push(stageName);
        return this;
    }
    withLogger(logger) {
        this.config.logger = logger;
        return this;
    }
    withTimeout(timeoutMs) {
        this.config.timeoutMs = timeoutMs;
        return this;
    }
    continueOnError(continueOnError) {
        this.config.continueOnError = continueOnError;
        return this;
    }
    build() {
        if (!this.config.logger) {
            throw new Error('Pipeline requires a logger');
        }
        const finalConfig = {
            logger: this.config.logger,
            timeoutMs: this.config.timeoutMs,
            continueOnError: this.config.continueOnError ?? false,
        };
        return new Pipeline_1.Pipeline(this.stages, finalConfig, this.criticalStages);
    }
}
exports.PipelineBuilder = PipelineBuilder;
//# sourceMappingURL=PipelineBuilder.js.map