export interface MCPServerConfig {
  name: string;
  transport: "stdio" | "sse" | "websocket";
  port?: number;
  command?: string;
  args?: string[];
  env?: Record<string, string>;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface MCPPrompt {
  name: string;
  description?: string;
  arguments?: Array<{ name: string; description?: string; required?: boolean }>;
}

export interface WorkflowStep {
  id: string;
  tool: string;
  input: Record<string, unknown>;
  timeout?: number;
  retry?: { maxAttempts: number; delay: number };
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  onError?: "stop" | "continue" | "retry";
}

export interface WorkflowResult {
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
