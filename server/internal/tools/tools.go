package tools

import (
	"context"
	"fmt"

	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"
)

// registers the MCP tools on the server.
func RegisterTools(s *server.MCPServer) {
	echoTool := mcp.NewTool("echo",
		mcp.WithDescription("Echoes back the provided message verbatim."),
		mcp.WithString("message",
			mcp.Required(),
			mcp.Description("The message to echo back."),
		),
	)
	s.AddTool(echoTool, handleEcho)

	addTool := mcp.NewTool("add",
		mcp.WithDescription("Adds two numbers together and returns their sum."),
		mcp.WithNumber("a",
			mcp.Required(),
			mcp.Description("The first number."),
		),
		mcp.WithNumber("b",
			mcp.Required(),
			mcp.Description("The second number."),
		),
	)
	s.AddTool(addTool, handleAdd)
}

// handleEcho implements the "echo" tool.
func handleEcho(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	args := req.GetArguments()
	message, _ := args["message"].(string)
	return mcp.NewToolResultText(message), nil
}

// handleAdd implements the "add" tool.
func handleAdd(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	args := req.GetArguments()
	a, _ := toFloat64(args["a"])
	b, _ := toFloat64(args["b"])
	sum := a + b
	return mcp.NewToolResultText(fmt.Sprintf("%g", sum)), nil
}

// toFloat64 converts a numeric value (as decoded from JSON) to a float64.
func toFloat64(v any) (float64, bool) {
	switch n := v.(type) {
	case float64:
		return n, true
	case float32:
		return float64(n), true
	case int:
		return float64(n), true
	case int64:
		return float64(n), true
	default:
		return 0, false
	}
}
