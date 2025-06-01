import { HUBSPOT_OBJECT_TYPES } from 'services/hubspot/models';
import z from 'zod';

export const AssociationSpecSchema = z.object({
  associationCategory: z.enum([
    'HUBSPOT_DEFINED',
    'USER_DEFINED',
    'INTEGRATOR_DEFINED',
  ]),
  associationTypeId: z.number().int().positive(),
});

const ObjectAssociationSchema = z.object({
  fromObjectType: z.string().describe(
    // eslint-disable-next-line max-len
    `The type of HubSpot object to create association from. Valid values include: ${HUBSPOT_OBJECT_TYPES.join(', ')}. For custom objects, use the hubspot-get-schemas tool to get the objectType.`,
  ),
  fromObjectId: z
    .string()
    .describe('The ID of the object to create association from'),
  toObjectType: z.string().describe(
    // eslint-disable-next-line max-len
    `The type of HubSpot object to create association to. Valid values include: ${HUBSPOT_OBJECT_TYPES.join(', ')}. For custom objects, use the hubspot-get-schemas tool to get the objectType.`,
  ),
  toObjectId: z
    .string()
    .describe('The ID of the object to create association to'),
  associations: z
    .array(AssociationSpecSchema)
    .min(1)
    .describe('List of association specifications defining the relationship'),
});

export default ObjectAssociationSchema;
