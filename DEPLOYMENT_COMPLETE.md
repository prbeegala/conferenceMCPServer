# Conference Companion MCP Server - Deployment Complete! 🎉

Your Conference Companion MCP Server has been successfully deployed to Azure!

## 🚀 Deployment Summary

- **Function App**: func-api-4guhfloo3ismo
- **Resource Group**: rg-conference-mcp-poc
- **Region**: Sweden Central
- **Endpoint**: https://func-api-4guhfloo3ismo.azurewebsites.net/
- **MCP Endpoint**: https://func-api-4guhfloo3ismo.azurewebsites.net/runtime/webhooks/mcp

## 🔑 Your MCP Extension Key

To get your MCP extension key, run:
```bash
az functionapp keys list --resource-group rg-conference-mcp-poc --name func-api-4guhfloo3ismo --query "systemKeys.mcp_extension" -o tsv
```

**⚠️ IMPORTANT**: Keep this key secure! It provides access to your MCP server. Never commit keys to source control.

---

## 📋 Available MCP Tools

Your server provides 6 conference management tools:

1. **list_sessions** - Browse and filter conference sessions
2. **get_speaker** - Get detailed speaker information  
3. **search_attendees** - Find attendees for networking
4. **get_venue_map** - Navigate conference locations
5. **build_agenda** - Create personalized schedules
6. **submit_question** - Submit Q&A questions for sessions

---

## 🔌 Connect to Your MCP Server in VS Code

### Step 1: Install MCP Extension (if needed)

The extension should already be available in VS Code. Check Extensions for "MCP" or "Model Context Protocol".

### Step 2: Configure MCP Client

Two options:

#### Option A: Using Pre-configured mcp.json (Recommended)

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "MCP: List Servers"
3. Find "remote-mcp-function" in the list
4. Click **Start Server**
5. When prompted, enter:
   - **Function App Name**: `func-api-4guhfloo3ismo`
   - **MCP Extension System Key**: (paste the key from the command above)

#### Option B: Manual Configuration

1. Open Settings (JSON) in VS Code
2. Add this configuration:

```json
{
  "mcp.servers": {
    "conference-companion": {
      "type": "http",
      "url": "https://func-api-4guhfloo3ismo.azurewebsites.net/runtime/webhooks/mcp",
      "headers": {
        "x-functions-key": "<YOUR_MCP_EXTENSION_KEY_HERE>"
      }
    }
  }
}
```

---

## 🧪 Test Your MCP Server

### Test with Natural Language in VS Code

1. Open **GitHub Copilot Chat** in VS Code
2. Try these example prompts:

```
Show me all conference sessions about AI
```

```
Find speakers with expertise in Kubernetes
```

```
Search for attendees interested in security
```

```
Get the venue map for Main Hall A
```

```
Build me an agenda with sessions session-001, session-003, and session-005
```

```
Submit a question for session-002: "What are the best practices for Durable Functions?"
```

### Test with MCP Inspector (Alternative)

1. Install and run MCP Inspector:
   ```bash
   npx @modelcontextprotocol/inspector node build/index.js
   ```

2. In the Inspector web UI:
   - Set transport type to `http`
   - URL: `https://func-api-4guhfloo3ismo.azurewebsites.net/runtime/webhooks/mcp?code=<YOUR_MCP_EXTENSION_KEY>`
   - Click **Connect**
   - Click **List Tools**
   - Select a tool and **Run Tool**

---

## 📊 Sample Conference Data

Your server includes:

- **6 Conference Sessions** across various tracks (AI, Cloud Native, DevOps, Security, Web, Data)
- **8 Speakers** with diverse expertise
- **8 Attendees** for networking examples
- **8 Venue Locations** including halls, workshops, and common areas

### Example Session IDs:
- `session-001` - Building Scalable AI Applications with Azure
- `session-002` - Serverless Applications with Azure Functions
- `session-003` - Container Orchestration with Kubernetes
- `session-004` - Securing Cloud Applications: Zero Trust Architecture
- `session-005` - Modern Web Development with Next.js and Azure
- `session-006` - Data Engineering at Scale with Azure Synapse

### Example Speaker IDs:
- `speaker-001` - Dr. Sarah Chen (AI & Cloud Architecture)
- `speaker-003` - Emily Watson (Serverless & Functions)
- `speaker-004` - Raj Patel (Kubernetes Expert)
- `speaker-006` - James Wilson (Security Architect)

---

## 🛠️ Project Structure

```
D:\Repos\ConferenceMCPServer\
├── data/                          # Conference data files
│   ├── sessions.json             # Conference sessions
│   ├── speakers.json             # Speaker profiles
│   ├── attendees.json            # Attendee directory
│   └── venues.json               # Venue locations
├── src/
│   └── functions/
│       ├── conferenceMcpTools.ts # Conference MCP tools (main)
│       ├── helloMcpTool.ts       # Example hello tool
│       └── snippetsMcpTool.ts    # Example snippets tool
├── infra/                        # Azure infrastructure (Bicep)
├── azure.yaml                    # AZD configuration
└── .vscode/
    └── mcp.json                  # MCP client configuration
```

---

## 🔄 Update and Redeploy

To make changes and redeploy:

```bash
# 1. Edit your code or data files
code src/functions/conferenceMcpTools.ts

# 2. Build locally
npm run build

# 3. Deploy updates
azd deploy
```

---

## 🧹 Clean Up Resources

When you're done testing:

```bash
azd down
```

This will delete all Azure resources and stop billing.

---

## 💡 Next Steps

### Customize Your Conference Data

Edit the JSON files in `data/` to add your own:
- Sessions, speakers, attendees, venues
- Additional fields and metadata
- Q&A responses, ratings, etc.

### Add More MCP Tools

Create new tools in `src/functions/conferenceMcpTools.ts`:
- Session ratings
- Attendee check-ins
- Speaker availability
- Networking recommendations
- Live polls
- Export agendas

### Add Authentication

For production use, add security:
- [API Management](https://aka.ms/mcp-remote-apim-auth) for OAuth and policies
- [Built-in authentication](https://learn.microsoft.com/azure/app-service/overview-authentication-authorization) with Microsoft Entra ID
- Enable VNET with `azd env set VNET_ENABLED true`

### Store Data in Azure Storage

Currently, data is loaded from JSON files. For dynamic data:
- Use Azure Blob Storage for conference data
- Use Azure Cosmos DB for real-time Q&A
- Use Azure SQL for relational data

---

## 📚 Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [Azure Functions MCP Template](https://github.com/Azure-Samples/remote-mcp-functions-typescript)
- [AZD Documentation](https://learn.microsoft.com/azure/developer/azure-developer-cli/)
- [Azure Functions Documentation](https://learn.microsoft.com/azure/azure-functions/)

---

## ✅ Troubleshooting

### Tools not appearing in VS Code?

1. Check server is running: `MCP: List Servers`
2. Restart the server
3. Check function app logs in Azure Portal

### Authentication errors?

1. Verify the system key is correct
2. Check key is in `x-functions-key` header
3. Try regenerating key in Azure Portal

### Sessions not found?

1. Verify `data/*.json` files were deployed
2. Check function app deployment in Azure Portal
3. View Application Insights logs

---

**🎊 Congratulations!** Your Conference Companion MCP Server is live and ready to assist with conference management through natural language!

