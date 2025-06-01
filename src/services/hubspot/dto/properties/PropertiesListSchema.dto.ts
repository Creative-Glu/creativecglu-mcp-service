import { HUBSPOT_OBJECT_TYPES } from 'services/hubspot/models';
import z from 'zod';

const PropertiesListSchema = z.object({
  objectType: z.string().describe(
    // eslint-disable-next-line max-len
    `The type of HubSpot object to get properties for. Valid values include: ${HUBSPOT_OBJECT_TYPES.join(', ')}. For custom objects, use the hubspot-get-schemas tool to get the objectType.`,
  ),
  archived: z
    .boolean()
    .default(false)
    .describe('Whether to return only properties that have been archived.'),
  includeHidden: z
    .boolean()
    .default(false)
    .describe('Whether to include hidden properties in the response.'),
});

export default PropertiesListSchema;
