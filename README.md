# @9d9/mcp-automation

Automation utilities for [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) workflows.

## Install

```bash
npm install @9d9/mcp-automation
```

## Usage

```ts
import {
  createWorkflow,
  addStep,
  createStep,
  executeWorkflow,
  createServerConfig,
  defineTool,
  defineResource,
} from "@9d9/mcp-automation";

// Define server config
const config = createServerConfig("my-server", "stdio", {
  command: "node",
  args: ["server.js"],
});

// Define tools
const tool = defineTool("query", "Query data", {
  type: "object",
  properties: { q: { type: "string" } },
});

// Build workflow
let workflow = createWorkflow("wf-1", "Data pipeline");
workflow = addStep(workflow, createStep("step-1", "query", { q: "hello" }));
workflow = addStep(workflow, createStep("step-2", "transform", { format: "json" }, { timeout: 5000 }));

// Execute
const result = await executeWorkflow(workflow, async (tool, input) => {
  // Your tool execution logic here
  return { data: "processed" };
});
```

## API

### Server Config
- `createServerConfig(name, transport, opts?)` — Build MCP server config

### Tool & Resource Definitions
- `defineTool(name, description, inputSchema)` — Define an MCP tool
- `defineResource(uri, name, opts?)` — Define an MCP resource

### Workflow Builder
- `createWorkflow(id, name)` — Create empty workflow
- `addStep(workflow, step)` — Add step to workflow (immutable)
- `createStep(id, tool, input, opts?)` — Create workflow step

### Workflow Execution
- `executeWorkflow(workflow, executor)` — Run workflow with custom executor
  - Supports timeout per step
  - Retry with configurable attempts and delay
  - Error handling: stop, continue, or retry

## License

MIT © [9d9 LLC](https://github.com/9d9ten)
