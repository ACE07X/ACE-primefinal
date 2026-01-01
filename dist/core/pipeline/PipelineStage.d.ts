import { Message } from 'discord.js';
export interface StageResult<T = unknown> {
    data: T;
    stageName: string;
    completedAt: Date;
    metadata?: Record<string, unknown>;
}
export interface PipelineContext {
    message: Message;
    stageResults: Map<string, StageResult>;
    startedAt: Date;
    currentStage?: string;
    errors: Array<{
        stage: string;
        error: Error;
    }>;
}
export declare abstract class PipelineStage<TInput = unknown, TOutput = unknown> {
    readonly stageName: string;
    protected readonly dependencies: string[];
    constructor(stageName: string, dependencies?: string[]);
    protected validateDependencies(context: PipelineContext): void;
    protected getStageResult<T = unknown>(context: PipelineContext, stageName: string): T;
    protected abstract executeStage(input: TInput, context: PipelineContext): Promise<TOutput> | TOutput;
    execute(input: TInput, context: PipelineContext): Promise<StageResult<TOutput>>;
}
//# sourceMappingURL=PipelineStage.d.ts.map