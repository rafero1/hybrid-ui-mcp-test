import MCPClient from "@/features/mcp/MCPClient";
import type { Test } from "@/features/types/test";

function parseResponseBody<T>(body: any): T {
  const parsed = JSON.parse(body.content[0].text);
  return parsed as T;
}

async function callMCPTool<T>(
  toolName: string,
  input?: { [x: string]: unknown },
): Promise<T> {
  const response = MCPClient.getInstance().callTool(toolName, input);
  try {
    const body = await response;
    return parseResponseBody<T>(body);
  } catch (error) {
    console.error(`Error calling tool ${toolName}:`, error);
    throw error;
  }
}

export async function getTestList(): Promise<Array<Test>> {
  return callMCPTool<Array<Test>>("list");
}

export async function add(a: number, b: number): Promise<number> {
  return callMCPTool<number>("add", { a, b });
}
