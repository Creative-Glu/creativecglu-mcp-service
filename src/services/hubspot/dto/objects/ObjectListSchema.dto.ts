import { HUBSPOT_OBJECT_TYPES } from 'services/hubspot/models';
import z from 'zod';

const ObjectListSchema = z.object({
  objectType: z.string().describe(
    // eslint-disable-next-line max-len
    `The type of HubSpot object to list. Valid values include: ${HUBSPOT_OBJECT_TYPES.join(', ')}. For custom objects, use the hubspot-get-schemas tool to get the objectType.`,
  ),
  limit: z
    .number()
    .int()
    .min(1)
    .max(500)
    .default(200)
    .describe('The maximum number of results to display per page (max: 500).'),
  after: z
    .string()
    .optional()
    .describe(
      'The paging cursor token of the last successfully read resource.',
    ),
  properties: z
    .array(z.string())
    .optional()
    .describe('A list of the properties to be returned in the response.'),
  associations: z
    .array(z.string())
    .optional()
    .describe(
      // eslint-disable-next-line max-len
      `A list of object types to retrieve associated IDs for (e.g., ${HUBSPOT_OBJECT_TYPES.join(', ')}).`,
    ),
  archived: z
    .boolean()
    .default(false)
    .describe('Whether to return only results that have been archived.'),
});

export default ObjectListSchema;
