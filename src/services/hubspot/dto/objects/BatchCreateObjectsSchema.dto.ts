import { HUBSPOT_OBJECT_TYPES } from 'services/hubspot/models';
import z from 'zod';

import { PropertiesSchema } from './BatchUpdateObjectSchema.dto';

export const AssociationTypeSchema = z.object({
  associationCategory: z.enum([
    'HUBSPOT_DEFINED',
    'USER_DEFINED',
    'INTEGRATOR_DEFINED',
  ]),
  associationTypeId: z.number().int().positive(),
});

export const AssociationSchema = z.object({
  types: z.array(AssociationTypeSchema).min(1),
  to: z.object({
    id: z.string().describe('ID of the object to associate with'),
  }),
});

export const ObjectInputSchema = z.object({
  properties: PropertiesSchema.describe('Object properties as key-value pairs'),
  associations: z
    .array(AssociationSchema)
    .optional()
    .describe('Optional list of associations to create with this object'),
  objectWriteTraceId: z
    .string()
    .optional()
    .describe('Optional trace ID for debugging purposes'),
});

const BatchCreateObjectsSchema = z.object({
  objectType: z.string().describe(
    // eslint-disable-next-line max-len
    `The type of HubSpot object to create. Valid values include: ${HUBSPOT_OBJECT_TYPES.join(', ')}. For custom objects, use the hubspot-get-schemas tool to get the objectType.`,
  ),
  inputs: z
    .array(ObjectInputSchema)
    .min(1)
    .max(100)
    .describe('Array of objects to create (maximum 100 per batch)'),
});

export default BatchCreateObjectsSchema;
