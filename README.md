# CreativeGlu MCP Service

CreativeGlu MCP Server is a Node.js (NestJS-based) backend application designed to serve as a multi-tool execution engine for AI agents using the **Model Context Protocol (MCP)**.  
It integrates with HubSpot CRM and supports dynamic tool execution, resource management, and AI-driven workflows for sales and RevOps automation.

---

## 🚀 Key Features

- Tool and prompt execution engine compatible with MCP  
- REST + HTTP streamable transport support  
- Seamless integration with HubSpot APIs  
- AI-friendly structure for use with n8n and LLM agents  
- Supports resource saving (e.g., deals, contacts) via URI-based schema  
- Ready for deployment on Docker, VM, or PaaS

---

## 🛠 Tech Stack

- Node.js v18+  
- NestJS framework  
- TypeORM with PostgreSQL or MongoDB  
- Docker-ready  
- Compatible with n8n automation workflows

---

## 📦 Pre-requisites

- **Node.js and npm**  
  Download and install from [nodejs.org](https://nodejs.org)  
- **Git**  
  Download from [git-scm.com](https://git-scm.com)

---

## 🔐 HubSpot Integration

1. Log in to your HubSpot account  
2. Navigate to: `Settings > Integrations > Private Apps`  
3. Click **"Create private app"**  
4. Enter a name and configure the required scopes  
5. Click **"Create app"**  
6. Copy the generated access token  
7. Add it to your `.env` file:
