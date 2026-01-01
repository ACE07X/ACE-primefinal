import { Pipeline } from './Pipeline';
import { PipelineStage } from './PipelineStage';
import { Logger } from '../../utils/logger';
export declare class PipelineBuilder<TOutput = unknown> {
    private stages;
    private criticalStages;
    private config;
    addStage(stage: PipelineStage): this;
    markCritical(stageName: string): this;
    withLogger(logger: Logger): this;
    withTimeout(timeoutMs: number): this;
    continueOnError(continueOnError: boolean): this;
    build(): Pipeline<TOutput>;
}
//# sourceMappingURL=PipelineBuilder.d.ts.map