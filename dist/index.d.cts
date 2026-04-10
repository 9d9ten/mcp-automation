interface MCPServerConfig {
    name: string;
    transport: "stdio" | "sse" | "websocket";
    port?: number;
    command?: string;
    args?: string[];
    env?: Record<string, string>;
}
interface MCPTool {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
}
interface MCPResource {
    uri: string;
    name: string;
    description?: string;
    mimeType?: string;
}
interface MCPPrompt {
    name: string;
    description?: string;
    arguments?: Array<{
        name: string;
        description?: string;
        required?: boolean;
    }>;
}
interface WorkflowStep {
    id: string;
    tool: string;
    input: Record<string, unknown>;
    timeout?: number;
    retry?: {
        maxAttempts: number;
        delay: number;
    };
}
interface Workflow {
    id: string;
    name: string;
    steps: WorkflowStep[];
    onError?: "stop" | "continue" | "retry";
}
interface WorkflowResult {
    workflowId: string;
    stepResults: Array<{
        stepId: string;
        success: boolean;
        output?: unknown;
        error?: string;
        duration: number;
    }>;
    totalDuration: number;
}

declare function createServerConfig(name: string, transport?: MCPServerConfig["transport"], opts?: Partial<MCPServerConfig>): MCPServerConfig;
declare function defineTool(name: string, description: string, inputSchema: Record<string, unknown>): MCPTool;
declare function defineResource(uri: string, name: string, opts?: {
    description?: string;
    mimeType?: string;
}): MCPResource;
declare function createWorkflow(id: string, name: string): Workflow;
declare function addStep(workflow: Workflow, step: WorkflowStep): Workflow;
declare function createStep(id: string, tool: string, input: Record<string, unknown>, opts?: Partial<WorkflowStep>): WorkflowStep;
declare function executeWorkflow(workflow: Workflow, executor: (tool: string, input: Record<string, unknown>) => Promise<unknown>): Promise<WorkflowResult>;

export { type MCPPrompt, type MCPResource, type MCPServerConfig, type MCPTool, type Workflow, type WorkflowResult, type WorkflowStep, addStep, createServerConfig, createStep, createWorkflow, defineResource, defineTool, executeWorkflow };
