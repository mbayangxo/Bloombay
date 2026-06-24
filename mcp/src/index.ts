#!/usr/bin/env node
import "dotenv/config";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";

import { userTools,     handleUserTool     } from "./tools/users.js";
import { clubTools,     handleClubTool     } from "./tools/clubs.js";
import { eventTools,    handleEventTool    } from "./tools/events.js";
import { girlmateTools, handleGirlmateTool } from "./tools/girlmates.js";
import { reportTools,   handleReportTool   } from "./tools/reports.js";
import { humanizeTools, handleHumanizeTool } from "./tools/humanize.js";
import { draftTools,    handleDraftTool    } from "./tools/drafts.js";
import { actionTools,   handleActionTool   } from "./tools/actions.js";
import { agentTools,    handleAgentTool    } from "./tools/agents.js";
import { memoryTools,   handleMemoryTool   } from "./tools/memory.js";

// ── Tool registry ─────────────────────────────────────────────────────────────

const ALL_TOOLS: Tool[] = [
  ...userTools,
  ...clubTools,
  ...eventTools,
  ...girlmateTools,
  ...reportTools,
  ...humanizeTools,
  ...draftTools,
  ...actionTools,
  ...agentTools,
  ...memoryTools,
];

type ToolHandler = (name: string, args: Record<string, unknown>) => Promise<{ content: { type: "text"; text: string }[] }>;

const HANDLERS: [Set<string>, ToolHandler][] = [
  [new Set(userTools.map(t => t.name)),     handleUserTool],
  [new Set(clubTools.map(t => t.name)),     handleClubTool],
  [new Set(eventTools.map(t => t.name)),    handleEventTool],
  [new Set(girlmateTools.map(t => t.name)), handleGirlmateTool],
  [new Set(reportTools.map(t => t.name)),   handleReportTool],
  [new Set(humanizeTools.map(t => t.name)), handleHumanizeTool],
  [new Set(draftTools.map(t => t.name)),    handleDraftTool],
  [new Set(actionTools.map(t => t.name)),   handleActionTool],
  [new Set(agentTools.map(t => t.name)),    handleAgentTool],
  [new Set(memoryTools.map(t => t.name)),   handleMemoryTool],
];

function route(name: string): ToolHandler | null {
  for (const [names, handler] of HANDLERS) {
    if (names.has(name)) return handler;
  }
  return null;
}

// ── MCP Server ────────────────────────────────────────────────────────────────

const server = new Server(
  {
    name:    "bloombay-mcp",
    version: "1.0.0",
  },
  {
    capabilities: { tools: {} },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: ALL_TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: rawArgs } = request.params;
  const args = (rawArgs ?? {}) as Record<string, unknown>;

  const handler = route(name);
  if (!handler) {
    return {
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
      isError: true,
    };
  }

  try {
    return await handler(name, args);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: "text", text: `Tool error (${name}): ${msg}` }],
      isError: true,
    };
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
