---
{"publish":true,"created":"2025-12-15T17:56:46.854+08:00","modified":"2025-12-16T10:58:08.754+08:00","published":"2025-12-16T10:58:08.754+08:00","tags":["claude_code"],"cssclasses":""}
---


# add `--scope user` when installing
e.g. `claude mcp add playwright npx @playwright/mcp@latest --scope user` 

# Manage installed MCPs on `.claude.json` on your machine's root directory.
```shell

$ cat ~/.claude.json

...
"mcpServers": {
    "context7": {...},
    "playwright": {...}
}
```
