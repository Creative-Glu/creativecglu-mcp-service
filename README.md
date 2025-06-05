# CreativeGlu MCP Service

CreativeGlu MCP Server is a Node.js (NestJS-based) backend application designed to serve as a multi-tool execution engine for AI agents using the **Model Context Protocol (MCP)**.  
It integrates with HubSpot CRM and supports dynamic tool execution, resource management, and AI-driven workflows for sales and RevOps automation.

---

## 🚀 Key Features

- Tool and prompt execution engine compatible with MCP  
- REST + HTTP streamable, Server Sent Events, STDIO transport support  
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

---

## 🔐 HubSpot Integration

1. Log in to your HubSpot account  
2. Navigate to: `Settings > Integrations > Private Apps`  
3. Click **"Create private app"**  
4. Enter a name and configure the required scopes  
5. Click **"Create app"**  
6. Copy the generated access token

---

## 🧩 Tools

This MCP server provides a suite of tools to interact with the HubSpot CRM API.

| Category      | Tool Name                          | Description |
|---------------|------------------------------------|-------------|
| OAuth         | hubspot-get-user-details           | Verifies the current HubSpot access token and returns user details, portal info, authorized scopes, and account metadata. |
| Objects       | hubspot-list-objects               | Lists CRM records of a specified object type with pagination support. |
| Objects       | hubspot-search-objects             | Searches CRM records using filter conditions and property-based queries. |
| Objects       | hubspot-batch-create-objects       | Creates multiple CRM records of the same type in one request. |
| Objects       | hubspot-batch-update-objects       | Updates multiple CRM records with new data in a single operation. |
| Objects       | hubspot-batch-read-objects         | Fetches multiple CRM records by ID in one batch request. |
| Objects       | hubspot-get-schemas                | Retrieves schema definitions and object type IDs for custom objects. |
| Properties    | hubspot-list-properties            | Lists all defined properties for a given CRM object type. |
| Properties    | hubspot-get-property               | Returns the definition and configuration of a specific property. |
| Properties    | hubspot-create-property            | Adds a new custom property to a specified CRM object type. |
| Properties    | hubspot-update-property            | Modifies an existing property's settings. |
| Associations  | hubspot-create-association         | Creates a relationship between two CRM records. |
| Associations  | hubspot-list-associations          | Retrieves associated records linked to a specific object. |
| Associations  | hubspot-get-association-definitions | Returns the list of valid association types between object types. |
| Engagements   | hubspot-create-engagement          | Creates a note or task and associates it with a CRM record. |
| Engagements   | hubspot-get-engagement             | Retrieves details of a specific engagement by ID. |
| Engagements   | hubspot-update-engagement          | Updates an existing engagement with new content or metadata. |
| Workflows     | hubspot-list-workflows             | Retrieves a list of workflows with pagination. |
| Workflows     | hubspot-get-workflow               | Returns detailed configuration and logic of a specific workflow. |
| Links         | hubspot-generate-feedback-link     | Generates a link for submitting feedback about tools or integrations. |
| Links         | hubspot-get-link                   | Produces a direct HubSpot URL to access a specific record in the UI. |
