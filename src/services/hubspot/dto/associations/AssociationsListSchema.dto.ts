import { HUBSPOT_OBJECT_TYPES } from 'services/hubspot/models';
import z from 'zod';

const AssociationsListSchema = z.object({
  objectType: z.string().describe(
    // eslint-disable-next-line max-len
    `The type of HubSpot object to get associations from. Valid values include: ${HUBSPOT_OBJECT_TYPES.join(', ')}. For custom objects, use the hubspot-get-schemas tool to get the objectType.`,
  ),
  objectId: z
    .string()
    .describe('The ID of the HubSpot object to get associations from'),
  toObjectType: z.string().describe(
    // eslint-disable-next-line max-len
    `The type of HubSpot object to get associations to. Valid values include: ${HUBSPOT_OBJECT_TYPES.join(', ')}. For custom objects, use the hubspot-get-schemas tool to get the objectType.`,
  ),
  after: z
    .string()
    .optional()
    .describe('Paging cursor token for retrieving the next page of results'),
});

export default AssociationsListSchema;
