// src/index.ts
function createServerConfig(name, transport = "stdio", opts) {
  return { name, transport, ...opts };
}
function defineTool(name, description, inputSchema) {
  return { name, description, inputSchema };
}
function defineResource(uri, name, opts) {
  return { uri, name, ...opts };
}
function createWorkflow(id, name) {
  return { id, name, steps: [], onError: "stop" };
}
function addStep(workflow, step) {
  return { ...workflow, steps: [...workflow.steps, step] };
}
function createStep(id, tool, input, opts) {
  return { id, tool, input, ...opts };
}
async function executeWorkflow(workflow, executor) {
  const startTime = Date.now();
  const stepResults = [];
  for (const step of workflow.steps) {
    const stepStart = Date.now();
    let attempts = step.retry?.maxAttempts ?? 1;
    let delay = step.retry?.delay ?? 1e3;
    let success = false;
    let output;
    let errorMsg;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        const promise = executor(step.tool, step.input);
        output = step.timeout ? await Promise.race([
          promise,
          new Promise(
            (_, reject) => setTimeout(() => reject(new Error("Step timeout")), step.timeout)
          )
        ]) : await promise;
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
      duration: Date.now() - stepStart
    });
    if (!success && workflow.onError === "stop") break;
  }
  return {
    workflowId: workflow.id,
    stepResults,
    totalDuration: Date.now() - startTime
  };
}
export {
  addStep,
  createServerConfig,
  createStep,
  createWorkflow,
  defineResource,
  defineTool,
  executeWorkflow
};
//# sourceMappingURL=index.js.map