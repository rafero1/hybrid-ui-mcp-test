@echo off
REM Build the MCP server as a Windows GUI-subsystem executable so it runs in
REM the background without popping up a console window.
setlocal

pushd %~dp0

echo Tidying Go module dependencies...
go mod tidy

echo Building hybrid-ui-mcp.exe (background / no console)...
go build -ldflags "-H windowsgui -s -w" -o hybrid-ui-mcp.exe ./cmd/server

echo.
echo Build succeeded: %~dp0hybrid-ui-mcp.exe
pause
popd

endlocal
