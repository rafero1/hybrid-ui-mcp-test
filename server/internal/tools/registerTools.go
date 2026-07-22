package tools

import (
	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"
)

// registers the MCP tools on the server.
func RegisterTools(s *server.MCPServer) {
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

	listTool := mcp.NewTool("list",
		mcp.WithDescription("Returns a list of tests."),
	)
	s.AddTool(listTool, handleList)
}
