package tools

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"strconv"
	"time"

	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"
)

func handleSimulateLongRunningProcess(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	itemNumber, err := req.RequireInt("itemNumber")
	if err != nil {
		return mcp.NewToolResultError(err.Error()), nil
	}
	if itemNumber <= 0 {
		return mcp.NewToolResultError("itemNumber must be a positive integer"), nil
	}

	// The client attaches a progress token to the call's _meta so the server
	// knows notifications should be tied back to this specific request.
	progressToken := req.Params.Meta.ProgressToken

	mcpServer := server.ServerFromContext(ctx)

	results := []Test{}

	for i := range itemNumber {
		// Check for cancellation
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		default:
		}

		// ---- Simulate work ----
		time.Sleep(time.Duration(rand.Intn(1000)) * time.Millisecond)

		item := Test{
			Id:   strconv.Itoa(i),
			Name: fmt.Sprintf("Item %d", i+1),
		}
		results = append(results, item)
		// -----------------------------------

		// Send progress update
		if mcpServer != nil {
			err := mcpServer.SendNotificationToClient(ctx, "notifications/progress", map[string]any{
				"progressToken": progressToken,
				"progress":      i + 1,
				"total":         itemNumber,
				"message":       fmt.Sprintf("Processed %s (%d/%d)", item.Name, i+1, itemNumber),
			})
			if err != nil {
				log.Printf("Failed to send notification: %v", err)
			}
		}
	}

	payload, err := json.Marshal(results)
	if err != nil {
		log.Printf("Failed to parse result json: %v", err)
		return mcp.NewToolResultError(err.Error()), nil
	}

	return mcp.NewToolResultText(fmt.Sprintf(`{"results":%s,"count":%d}`,
		string(payload), len(results))), nil
}
