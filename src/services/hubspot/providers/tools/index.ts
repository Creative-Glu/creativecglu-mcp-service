import CreateAssociationTool from './associations/CreateAssociation.tool';
import GetAssociationDefinitionsTool from './associations/GetAssociationDefinitions.tool';
import ListAssociationsTool from './associations/ListAssociations.tool';
import BatchCreateObjectsTool from './objects/BatchReadObjects.tool';
import BatchReadObjectsTool from './objects/BatchReadObjects.tool';
import BatchUpdateObjectsTool from './objects/BatchUpdateObjects.tool';
import GetSchemaTool from './objects/GetSchema.tool';
import ListObjectsTool from './objects/ListObjects.tool';
import SearchObjectsTool from './objects/SearchObjects.tool';

export default [
  GetSchemaTool,
  SearchObjectsTool,
  BatchCreateObjectsTool,
  BatchReadObjectsTool,
  BatchUpdateObjectsTool,
  ListObjectsTool,
  CreateAssociationTool,
  GetAssociationDefinitionsTool,
  ListAssociationsTool,
];
