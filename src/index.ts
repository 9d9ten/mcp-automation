import {
  type MCPServerConfig,
  type MCPTool,
  type MCPResource,
  type Workflow,
  type WorkflowStep,
  type WorkflowResult,
} from "./types.js";

// --- Server Config Builder ---
export function createServerConfig(
  name: string,
  transport: MCPServerConfig["transport"] = "stdio",
  opts?: Partial<MCPServerConfig>
): MCPServerConfig {
  return { name, transport, ...opts };
}

// --- Tool Definition Helper ---
export function defineTool(
  name: string,
  description: string,
  inputSchema: Record<string, unknown>
): MCPTool {
  return { name, description, inputSchema };
}

// --- Resource Definition Helper ---
export function defineResource(
  uri: string,
  name: string,
  opts?: { description?: string; mimeType?: string }
): MCPResource {
  return { uri, name, ...opts };
}

// --- Workflow Builder ---
export function createWorkflow(id: string, name: string): Workflow {
  return { id, name, steps: [], onError: "stop" };
}

export function addStep(
  workflow: Workflow,
  step: WorkflowStep
): Workflow {
  return { ...workflow, steps: [...workflow.steps, step] };
}

export function createStep(
  id: string,
  tool: string,
  input: Record<string, unknown>,
  opts?: Partial<WorkflowStep>
): WorkflowStep {
  return { id, tool, input, ...opts };
}

// --- Workflow Execution (simulated) ---
export async function executeWorkflow(
  workflow: Workflow,
  executor: (tool: string, input: Record<string, unknown>) => Promise<unknown>
): Promise<WorkflowResult> {
  const startTime = Date.now();
  const stepResults: WorkflowResult["stepResults"] = [];

  for (const step of workflow.steps) {
    const stepStart = Date.now();
    let attempts = step.retry?.maxAttempts ?? 1;
    let delay = step.retry?.delay ?? 1000;
    let success = false;
    let output: unknown;
    let errorMsg: string | undefined;

    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        const promise = executor(step.tool, step.input);
        output = step.timeout
          ? await Promise.race([
              promise,
              new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("Step timeout")), step.timeout)
              ),
            ])
          : await promise;
        success = true;
        break;
      } catch (e) {
        errorMsg = e instanceof Error ? e.message : String(e);
        if (attempt < attempts) {
          await new Promise((r) => setTimeout(r, delay * attempt));
        }
      }
    }

    stepResults.push({
      stepId: step.id,
      success,
      output,
      error: errorMsg,
      duration: Date.now() - stepStart,
    });

    if (!success && workflow.onError === "stop") break;
  }

  return {
    workflowId: workflow.id,
    stepResults,
    totalDuration: Date.now() - startTime,
  };
}

export * from "./types.js";
