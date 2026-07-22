package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"hybrid-ui/server/internal/tools"

	"github.com/mark3labs/mcp-go/server"
)

const (
	appName    = "hybrid-ui-mcp-server"
	appVersion = "0.1.0"
)

func main() {
	addr := flag.String("addr", "127.0.0.1:8080", "address for the MCP HTTP/SSE server to listen on")
	flag.Parse()

	mcpServer := server.NewMCPServer(
		appName,
		appVersion,
		server.WithToolCapabilities(true),
		server.WithResourceCapabilities(true, true),
		server.WithLogging(),
	)

	tools.RegisterTools(mcpServer)

	httpServer := server.NewStreamableHTTPServer(mcpServer,
		server.WithEndpointPath("/mcp"),
		server.WithStreamableHTTPCORS(
			server.WithCORSAllowedOrigins("http://localhost:5173"),
			server.WithCORSAllowCredentials(),
			server.WithCORSAllowedHeaders(
				"Content-Type",
				"Authorization",
				"Accept",
				"Mcp-Session-Id",
				"Mcp-Protocol-Version",
				"Last-Event-ID",
			),
			server.WithCORSAllowedMethods("GET", "POST", "OPTIONS"),
			server.WithCORSMaxAge(300),
		),
	)

	// Run the server on a goroutine so the main goroutine can wait for a
	// shutdown signal (Ctrl+C, window close, or taskkill).
	errCh := make(chan error, 1)
	go func() {
		log.Printf("%s v%s starting on http://%s/mcp", appName, appVersion, *addr)
		if err := httpServer.Start(*addr); err != nil {
			errCh <- fmt.Errorf("http server stopped: %w", err)
		}
	}()

	// Wait for either an error from the server or an OS interrupt signal.
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, os.Interrupt, syscall.SIGTERM)

	select {
	case err := <-errCh:
		if err != nil {
			log.Printf("server error: %v", err)
		}
	case sig := <-sigCh:
		log.Printf("received signal %v, shutting down...", sig)
	}

	// Shut the HTTP server down gracefully.
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	if err := httpServer.Shutdown(ctx); err != nil {
		log.Printf("graceful shutdown error: %v", err)
	}
}
