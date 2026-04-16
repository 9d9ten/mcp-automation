# @9d9/mcp-automation

<p align="center">
  <strong>模型上下文协议 (MCP) 工作流自动化工具库</strong>
</p>

## 安装

```bash
npm install @9d9/mcp-automation
```

## 快速开始

```ts
import { createWorkflow, addStep, createStep, executeWorkflow, defineTool, defineResource } from "@9d9/mcp-automation";

// 定义工具
const tool = defineTool("query", "查询数据", { type: "object", properties: { q: { type: "string" } } });

// 构建工作流
let workflow = createWorkflow("wf-1", "数据处理管线");
workflow = addStep(workflow, createStep("step-1", "query", { q: "你好" }));
workflow = addStep(workflow, createStep("step-2", "transform", { format: "json" }, { timeout: 5000 }));

// 执行工作流
const result = await executeWorkflow(workflow, async (tool, input) => {
  return { data: "已处理" };
});
```

## API 参考

| 函数 | 描述 |
|---|---|
| `createServerConfig(name, transport, opts?)` | 构建 MCP 服务器配置 |
| `defineTool(name, desc, schema)` | 定义 MCP 工具 |
| `defineResource(uri, name, opts?)` | 定义 MCP 资源 |
| `createWorkflow(id, name)` | 创建空工作流 |
| `addStep(workflow, step)` | 添加步骤 |
| `createStep(id, tool, input, opts?)` | 创建步骤 |
| `executeWorkflow(workflow, executor)` | 执行工作流 |

## 许可证

MIT © [9d9 LLC](https://github.com/9d9ten)
