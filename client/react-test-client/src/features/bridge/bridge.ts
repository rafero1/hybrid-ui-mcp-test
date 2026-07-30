import MCPClient from "@/features/mcp/MCPClient";
import { type OnProgressUpdate, type ToolCallbacks } from "../mcp/types";
import type { Test } from "@/features/types/test";
import { parseMcpToolResponseBody } from "../mcp/utils";

async function callMCPTool<T>(
  toolName: string,
  input?: { [x: string]: unknown },
  callbacks?: ToolCallbacks,
): Promise<T> {
  const body = await MCPClient.getInstance().callTool(
    toolName,
    input,
    callbacks,
  );
  return parseMcpToolResponseBody<T>(body);
}

export async function getTestList(): Promise<Array<Test>> {
  return callMCPTool<Array<Test>>("list");
}

export async function add(a: number, b: number): Promise<number> {
  return callMCPTool<number>("add", { a, b });
}

export async function simulateLongRunningProcess(
  itemNumber: number,
  onProgressUpdate?: OnProgressUpdate,
) {
  return callMCPTool<{
    results: Array<Test>;
    count: number;
  }>(
    "simulateLongRunningProcess",
    {
      itemNumber,
    },
    onProgressUpdate && { onProgressUpdate },
  );
}
