import { Client } from "@modelcontextprotocol/sdk/client";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp";
import type { Tool } from "@modelcontextprotocol/sdk/types";

class MCPClient {
  private static instance: MCPClient | null = null;
  private mcp: Client;
  private transport: StreamableHTTPClientTransport | null = null;
  private isConnected = false;
  private tools: Tool[] = [];

  private constructor() {
    this.mcp = new Client({ name: "Hybrid UI", version: "0.1.0" });
  }

  static getInstance(): MCPClient {
    if (!MCPClient.instance) {
      MCPClient.instance = new MCPClient();
    }
    return MCPClient.instance;
  }

  async connect(url: URL): Promise<void> {
    if (this.isConnected) {
      console.warn("Already connected to MCP server.");
      return;
    }

    try {
      this.transport = new StreamableHTTPClientTransport(url);

      await this.mcp.connect(this.transport);
      this.isConnected = true;
      console.log("Connected to MCP server at", url.toString());

      const toolsOnServer = await this.mcp.listTools();
      console.log("Available tools on server:", toolsOnServer);

      this.tools = toolsOnServer.tools.map(tool => {
        return {
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
          outputSchema: tool.outputSchema,
        };
      });
    } catch (error) {
      console.error("Error connecting to MCP server:", error);
      throw error;
    }
  }

  async callTool(
    toolName: (typeof this.tools)[number]["name"],
    input: { [x: string]: unknown } | undefined,
  ): Promise<any> {
    if (!this.isConnected) {
      throw new Error("Not connected to MCP server.");
    }

    const response = await this.mcp.callTool({
      name: toolName,
      arguments: input,
    });

    return response;
  }
}

export default MCPClient;
