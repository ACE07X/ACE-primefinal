import { Message } from 'discord.js';
import { PipelineStage, StageResult } from './PipelineStage';
import { Logger } from '../../utils/logger';
export interface PipelineConfig {
    timeoutMs?: number;
    continueOnError?: boolean;
    logger: Logger;
}
export interface PipelineExecutionResult<T = unknown> {
    output: T;
    stageResults: Map<string, StageResult>;
    executionTimeMs: number;
    success: boolean;
    errors: Array<{
        stage: string;
        error: Error;
    }>;
}
export declare class Pipeline<TOutput = unknown> {
    private readonly stages;
    private readonly config;
    private readonly logger;
    private readonly criticalStages;
    constructor(stages: PipelineStage[], config: PipelineConfig, criticalStages?: string[]);
    private validatePipeline;
    private createContext;
    execute(message: Message): Promise<PipelineExecutionResult<TOutput>>;
    getStageNames(): string[];
    hasStage(stageName: string): boolean;
    validatePersonaOrdering(personaStage: string, promptStage: string): void;
}
//# sourceMappingURL=Pipeline.d.ts.map