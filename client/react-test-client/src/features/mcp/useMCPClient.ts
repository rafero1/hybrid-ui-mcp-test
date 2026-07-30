import { useEffect } from "react";
import MCPClient from "./MCPClient";

function useMCPClient() {
  useEffect(() => {
    MCPClient.getInstance()
      .connect(new URL("http://localhost:8080/mcp"))
      .catch(err => {
        console.error("Failed to connect to MCP server:", err);
      });
  }, []);
}

export default useMCPClient;
