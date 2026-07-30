import { Client } from "@modelcontextprotocol/sdk/client";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp";
import {
  ProgressNotificationSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types";
import type {
  TextResponseContent,
  ProgressListenerCallback,
  ToolCallbacks,
} from "./types";
import { AI } from "./ai";

const progressListeners = new Map<string | number, ProgressListenerCallback>();

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
      throw new Error(`[callTool][${toolName}] Not connected to MCP server`);
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
    console.log(`[callTool][${toolName}] response:`, response);

    try {
      return response;
    } finally {
      // small delay to prevent race condition (listener deleted before it can process the last notification of a stack)
      setTimeout(() => {
        progressListeners.delete(progressToken);
      }, 100);
    }
  }

  // TODO: some parts of this change depending on the API. It should be owned by the AI wrapper object
  async processQuery(query: string): Promise<TextResponseContent[]> {
    try {
      const messages: TextResponseContent[] = [];

      const response = await AI.gemini.call(query, this.tools);

      if (!response.ok) {
        throw new Error(
          `HTTP Error. Status: ${response.status}. Body: ${response.body}`,
        );
      }

      // data here has the decoded response json object, which is pretty big and has all the result info outputted by the model
      const data = await response.json();
      console.log("[processQuery] response:", data);

      const interactionId = data.id;

      // every interaction will have a several steps. We loop through them to see if there's a function call

      const loopThroughSteps = async (tools: Tool[], data: any) => {
        for (const step of data.steps) {
          if (step.type === "function_call") {
            // TODO: user should be asked to agree to some tool calls first. If they disagree, don't call

            if (tools.some(tool => tool.name === step.name)) {
              const toolResult = await this.callTool(step.name, step.arguments);

              messages.push({
                type: "text",
                text: `[Calling tool "${step.name}"...]`,
              });

              // send back the tool output back to the model

              const toolResultQuery = {
                type: "function_result",
                name: step.name,
                call_id: step.id,
                result: JSON.stringify(
                  (toolResult.content as TextResponseContent[])[0],
                ),
              };

              const toolResultQueryResponse = await AI.gemini.call(
                JSON.stringify(toolResultQuery),
                tools,
                interactionId,
              );

              const data = await toolResultQueryResponse.json();
              console.log(data);

              return loopThroughSteps(tools, data);
            }
          }
          if (step.type === "model_output") {
            messages.push(step.content[0]);
            return messages;
          }
        }

        throw new Error(
          "Model did not return a valid output. Expected a 'model_output' or 'function_result' inside 'steps'",
        );
      };

      return loopThroughSteps(this.tools, data);
    } catch (error) {
      console.log("[processQuery] Error calling AI:", error);
      throw error;
    }
  }
}

export default MCPClient;
