import type { Tool } from "@modelcontextprotocol/sdk/types";

// type GeminiPropType = "string" | "number";

// type GeminiParameters = {
//   type: "object";
//   properties: {
//     [key: string]:
//       | { type: GeminiPropType }
//       | { type: "array"; items: { type: GeminiPropType } };
//   };
//   required: string[];
// };

interface GeminiTool {
  type: "function";
  name: string;
  description: string;
  parameters?: Tool["inputSchema"];
}

interface GeminiRequestBody {
  model: string;
  input: string;
  tools?: GeminiTool[];
  previous_interaction_id?: string;
}

function toolMcpToGemini(tool: Tool): GeminiTool {
  return {
    type: "function",
    name: tool.name,
    description: tool.description || "No description given",
    parameters: tool.inputSchema,
  };
}

// TODO: API Key is sensitive, so it shouldn't be imported like this or it'll be exposed to the client (browser)
// https://vite.dev/guide/env-and-mode
const ApiKey = import.meta.env.VITE_GEMINI_API_KEY ?? "";

export const AI = {
  gemini: {
    call(query: string, tools?: Tool[], previous_interaction_id?: string) {
      const headers = {
        "x-goog-api-key": ApiKey,
        "Content-Type": "application/json",
      };

      const body: GeminiRequestBody = {
        model: "gemini-3.1-flash-lite",
        input: query,
        tools: tools?.map(tool => toolMcpToGemini(tool)),
        previous_interaction_id,
      };

      return fetch(
        new Request(
          "https://generativelanguage.googleapis.com/v1beta/interactions",
          {
            method: "POST",
            headers,
            body: JSON.stringify(body),
          },
        ),
      );
    },
  },
};
