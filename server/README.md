# hybrid-ui-mcp server

A small Go desktop application that runs an **MCP (Model Context Protocol) server** in the background.

## Requirements

- Go 1.24+ (<https://go.dev/dl/>)

## Build

From the `server/` folder:

```bat
build.bat
```

or manually:

```sh
go mod tidy
go build -ldflags "-H windowsgui -s -w" -o hybrid-ui-mcp.exe ./cmd/server
```

The `-H windowsgui` linker flag builds the executable with the Windows GUI subsystem, so launching it opens **no console window** which runs in the background.

## Run

Double-click `hybrid-ui-mcp.exe`, or launch it from a terminal:

```sh
.\hybrid-ui-mcp.exe
```

By default the server listens on:

```sh
http://127.0.0.1:8080/mcp
```

Use the `-addr` flag to change the address, e.g.:

```sh
.\hybrid-ui-mcp.exe -addr 127.0.0.1:9090
```

To stop the server, end the `hybrid-ui-mcp.exe` process from Task Manager, or run:

```sh
taskkill /IM hybrid-ui-mcp.exe /F
```
