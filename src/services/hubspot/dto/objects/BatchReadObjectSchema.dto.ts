import { HUBSPOT_OBJECT_TYPES } from 'services/hubspot/models';
import z from 'zod';

export const ObjectReadInputSchema = z.object({
  id: z.string().describe('ID of the object to read'),
});

const BatchReadObjectsSchema = z.object({
  objectType: z.string().describe(
    // eslint-disable-next-line max-len
    `The type of HubSpot object to read. Valid values include: ${HUBSPOT_OBJECT_TYPES.join(', ')}. For custom objects, use the hubspot-get-schemas tool to get the objectType.`,
  ),
  inputs: z
    .array(ObjectReadInputSchema)
    .min(1)
    .max(100)
    .describe('Array of object IDs to read (maximum 100 per batch)'),
  properties: z
    .array(z.string())
    .optional()
    .describe('Optional list of property names to include in the results'),
  propertiesWithHistory: z
    .array(z.string())
    .optional()
    .describe('Optional list of property names to include with history'),
});

export default BatchReadObjectsSchema;
