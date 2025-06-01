import { HUBSPOT_OBJECT_TYPES } from 'services/hubspot/models';
import z from 'zod';

const AssociationSchemaDefinitionSchema = z.object({
  fromObjectType: z.string().describe(
    // eslint-disable-next-line max-len
    `The type of HubSpot object to get association from. Valid values include: ${HUBSPOT_OBJECT_TYPES.join(', ')}. For custom objects, use the hubspot-get-schemas tool to get the objectType.`,
  ),
  toObjectType: z.string().describe(
    // eslint-disable-next-line max-len
    `The type of HubSpot object to get association to. Valid values include: ${HUBSPOT_OBJECT_TYPES.join(', ')}. For custom objects, use the hubspot-get-schemas tool to get the objectType.`,
  ),
});

export default AssociationSchemaDefinitionSchema;
