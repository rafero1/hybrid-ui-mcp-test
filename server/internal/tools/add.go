package tools

import (
	"context"
	"fmt"

	"github.com/mark3labs/mcp-go/mcp"
)

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
