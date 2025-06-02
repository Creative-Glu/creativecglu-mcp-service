import { HUBSPOT_OBJECT_TYPES } from 'services/hubspot/models';
import z from 'zod';

export const PropertiesSchema = z.record(z.string(), z.string());

export const ObjectUpdateInputSchema = z.object({
  id: z.string().describe('ID of the object to update'),
  properties: PropertiesSchema.describe('Object properties as key-value pairs'),
  idProperty: z
    .string()
    .optional()
    .describe('Optional unique property name to use as the ID'),
  objectWriteTraceId: z
    .string()
    .optional()
    .describe('Optional trace ID for debugging purposes'),
});

const BatchUpdateObjectsSchema = z.object({
  objectType: z.string().describe(
    // eslint-disable-next-line max-len
    `The type of HubSpot object to update. Valid values include: ${HUBSPOT_OBJECT_TYPES.join(', ')}. For custom objects, use the hubspot-get-schemas tool to get the objectType.`,
  ),
  inputs: z
    .array(ObjectUpdateInputSchema)
    .min(1)
    .max(100)
    .describe('Array of objects to update (maximum 100 per batch)'),
});

export default BatchUpdateObjectsSchema;
