"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  addStep: () => addStep,
  createServerConfig: () => createServerConfig,
  createStep: () => createStep,
  createWorkflow: () => createWorkflow,
  defineResource: () => defineResource,
  defineTool: () => defineTool,
  executeWorkflow: () => executeWorkflow
});
module.exports = __toCommonJS(index_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addStep,
  createServerConfig,
  createStep,
  createWorkflow,
  defineResource,
  defineTool,
  executeWorkflow
});
//# sourceMappingURL=index.cjs.map