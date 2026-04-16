# @9d9/mcp-automation

<p align="center">
  <strong>Automation utilities for Model Context Protocol (MCP) workflows</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@9d9/mcp-automation"><img src="https://img.shields.io/npm/v/@9d9/mcp-automation?color=blue" alt="npm"></a>
  <a href="https://github.com/9d9ten/mcp-automation/actions"><img src="https://img.shields.io/github/actions/workflow/status/9d9ten/mcp-automation/ci.yml?branch=main" alt="CI"></a>
  <a href="https://github.com/9d9ten/mcp-automation/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@9d9/mcp-automation" alt="License"></a>
  <a href="https://github.com/sponsors/9d9ten"><img src="https://img.shields.io/badge/Sponsor-@9d9-pink?logo=github" alt="Sponsor"></a>
</p>

## Why?

Building MCP-based automation? This package provides a declarative workflow engine:

- **Workflow builder** — Define multi-step workflows with a fluent API
- **Tool & resource definitions** — Type-safe MCP tool/resource schemas
- **Workflow execution engine** — Run workflows with timeout, retry, and error handling
- **Server config builder** — Configure MCP servers (stdio, SSE, WebSocket)

## Install

```bash
npm install @9d9/mcp-automation
```

## Quick Start

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

// Define MCP server config
const config = createServerConfig("my-server", "stdio", {
  command: "node",
  args: ["server.js"],
});

// Define tools
const queryTool = defineTool("query", "Query data", {
  type: "object",
  properties: { q: { type: "string" } },
});

// Define resources
const dbResource = defineResource("mcp://db/users", "Users Database", {
  description: "User records",
  mimeType: "application/json",
});

// Build workflow
let workflow = createWorkflow("wf-1", "Data pipeline");
workflow = addStep(workflow, createStep("step-1", "query", { q: "hello" }));
workflow = addStep(workflow, createStep("step-2", "transform", { format: "json" }, {
  timeout: 5000,
  retry: { maxAttempts: 3, delay: 1000 },
}));

// Execute
const result = await executeWorkflow(workflow, async (tool, input) => {
  // Your tool execution logic
  return { data: "processed" };
});
// result.stepResults → [{ stepId, success, output, duration }]
// result.totalDuration → 123
```

## API Reference

### Server Config
| Function | Description |
|---|---|
| `createServerConfig(name, transport, opts?)` | Build MCP server config |

### Definitions
| Function | Description |
|---|---|
| `defineTool(name, description, inputSchema)` | Define an MCP tool |
| `defineResource(uri, name, opts?)` | Define an MCP resource |

### Workflow Builder
| Function | Description |
|---|---|
| `createWorkflow(id, name)` | Create empty workflow |
| `addStep(workflow, step)` | Add step (returns new workflow) |
| `createStep(id, tool, input, opts?)` | Create a step |

### Workflow Execution
| Function | Description |
|---|---|
| `executeWorkflow(workflow, executor)` | Run workflow with custom executor |

Step options:
```ts
interface WorkflowStep {
  id: string;
  tool: string;
  input: Record<string, unknown>;
  timeout?: number;           // Step timeout in ms
  retry?: {
    maxAttempts: number;
    delay: number;            // Base delay for exponential backoff
  };
}
```

Workflow error handling:
```ts
workflow.onError = "stop";      // Stop on first error (default)
workflow.onError = "continue";  // Continue on error
workflow.onError = "retry";     // Retry failed steps
```

## Ecosystem

| Package | Description |
|---|---|
| [`@9d9/pulsemcp-core`](https://npmjs.com/package/@9d9/pulsemcp-core) | Core utilities |
| [`@9d9/openclaw-utils`](https://npmjs.com/package/@9d9/openclaw-utils) | OpenClaw utilities |
| [`@9d9/mcp-automation`](https://npmjs.com/package/@9d9/mcp-automation) | MCP workflow automation (this package) |

## License

MIT © [9d9 LLC](https://github.com/9d9ten)
