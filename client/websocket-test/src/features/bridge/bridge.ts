import MCPClient from "@/features/mcp/MCPClient";
import type { Test } from "@/features/types/test";

function parseResponseBody<T>(body: any): T {
  const parsed = JSON.parse(body.content[0].text);
  return parsed as T;
}

export async function getTestList(): Promise<Array<Test>> {
  const response = MCPClient.getInstance().callTool("list");
  return response
    .then(body => {
      return parseResponseBody<Array<Test>>(body);
    })
    .catch(error => {
      console.error("Error fetching test list:", error);
      throw error;
    });
}

export async function add(a: number, b: number): Promise<number> {
  const response = MCPClient.getInstance().callTool("add", { a, b });
  return response
    .then(body => {
      return parseResponseBody<number>(body);
    })
    .catch(error => {
      console.error("Error adding numbers:", error);
      throw error;
    });
}
