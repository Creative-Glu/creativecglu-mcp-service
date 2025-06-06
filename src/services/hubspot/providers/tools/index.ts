import CreateAssociationTool from './associations/CreateAssociation.tool';
import GetAssociationDefinitionsTool from './associations/GetAssociationDefinitions.tool';
import ListAssociationsTool from './associations/ListAssociations.tool';
import CreateEngagementTool from './engagements/CreateEngagement.tool';
import GetEngagementTool from './engagements/GetEngagement.tool';
import UpdateEngagementTool from './engagements/UpdateEngagement.tool';
import FeedbackLinkTool from './links/FeedbackLink.tool';
import GetHubspotLinkTool from './links/GetHubspotLink.tool';
import UserCredentialsTool from './oauth/UserCredentials.tool';
import BatchCreateObjectsTool from './objects/BatchCreateObejcts.tool';
import BatchReadObjectsTool from './objects/BatchReadObjects.tool';
import BatchUpdateObjectsTool from './objects/BatchUpdateObjects.tool';
import GetSchemaTool from './objects/GetSchema.tool';
import ListObjectsTool from './objects/ListObjects.tool';
import SearchObjectsTool from './objects/SearchObjects.tool';
import CreatePropertyTool from './properties/CreateProperty.tool';
import GetPropertyTool from './properties/GetProperty.tool';
import ListPropertiesTool from './properties/ListProperties.tool';
import UpdatePropertyTool from './properties/UpdateProperty.tool';
import GetWorkflowTool from './workflows/GetWorkflow.tool';
import WorkflowsListTool from './workflows/WorkflowsList.tool';

export default [
  GetWorkflowTool,
  WorkflowsListTool,
  UserCredentialsTool,
  BatchCreateObjectsTool,
  BatchReadObjectsTool,
  BatchUpdateObjectsTool,
  CreateAssociationTool,
  CreateEngagementTool,
  CreatePropertyTool,
  FeedbackLinkTool,
  GetAssociationDefinitionsTool,
  GetEngagementTool,
  GetHubspotLinkTool,
  GetPropertyTool,
  GetSchemaTool,
  ListAssociationsTool,
  ListObjectsTool,
  ListPropertiesTool,
  SearchObjectsTool,
  UpdateEngagementTool,
  UpdatePropertyTool,
];
