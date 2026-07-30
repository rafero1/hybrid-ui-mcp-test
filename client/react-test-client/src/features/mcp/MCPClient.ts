import { Client } from "@modelcontextprotocol/sdk/client";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp";
import {
  ProgressNotificationSchema,
  type ProgressNotificationParams,
  type Tool,
} from "@modelcontextprotocol/sdk/types";

export type ProgressListenerCallback = (
  notificationParams: ProgressNotificationParams,
) => void;

const progressListeners = new Map<string | number, ProgressListenerCallback>();

export type OnProgressUpdate = (
  notificationParams: ProgressNotificationParams,
) => void;

export type ToolCallbacks = {
  onProgressUpdate?: OnProgressUpdate;
};

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

  setupNotificationHandlers() {
    this.mcp.setNotificationHandler(
      ProgressNotificationSchema,
      notification => {
        const listener = progressListeners.get(
          notification.params.progressToken,
        );
        listener?.(notification.params);
        console.log(
          `[ProgressUpdate][${notification.params.progressToken}]`,
          notification.params,
        );
      },
    );
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

      this.setupNotificationHandlers();

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
    toolName: string,
    input?: { [x: string]: unknown },
    callbacks?: ToolCallbacks,
  ): Promise<typeof response> {
    if (!this.isConnected) {
      throw new Error("Not connected to MCP server.");
    }

    // Every progress notification from the server carries this token back,
    // so we know it belongs to this specific tool call.
    const progressToken = crypto.randomUUID();

    if (callbacks?.onProgressUpdate) {
      progressListeners.set(progressToken, callbacks.onProgressUpdate);
    }

    const response = await this.mcp.callTool({
      name: toolName,
      arguments: input,
      _meta: {
        progressToken,
      },
    });
    console.log(`Response from tool "${toolName}":`, response);

    try {
      return response;
    } finally {
      progressListeners.delete(progressToken);
    }
  }
}

export default MCPClient;
