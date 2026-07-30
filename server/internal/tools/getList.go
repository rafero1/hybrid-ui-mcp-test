package tools

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/mark3labs/mcp-go/mcp"
)

func handleList(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	list := []Test{
		{Id: "1", Name: "Test 1"},
		{Id: "2", Name: "Test 2"}}

	jsonData, err := json.Marshal(list)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal test list: %w", err)
	}

	return mcp.NewToolResultText(string(jsonData)), nil
}
