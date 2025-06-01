import { HUBSPOT_OBJECT_TYPES } from 'services/hubspot/models';
import z from 'zod';

import { PropertyOptionSchema } from './CreatePropertySchema.dto';

const UpdatePropertySchema = z.object({
  objectType: z.string().describe(
    // eslint-disable-next-line max-len
    `The type of HubSpot object the property belongs to. Valid values include: ${HUBSPOT_OBJECT_TYPES.join(', ')}. For custom objects, use the hubspot-get-schemas tool to get the objectType.`,
  ),
  propertyName: z.string().describe('The name of the property to update'),
  label: z
    .string()
    .optional()
    .describe('A human-readable property label that will be shown in HubSpot'),
  description: z
    .string()
    .optional()
    .describe('A description of the property that will be shown as help text'),
  groupName: z
    .string()
    .optional()
    .describe('The name of the property group the property belongs to'),
  type: z
    .enum(['string', 'number', 'date', 'datetime', 'enumeration', 'bool'])
    .optional()
    .describe('The data type of the property'),
  fieldType: z
    .enum([
      'text',
      'textarea',
      'date',
      'file',
      'number',
      'select',
      'radio',
      'checkbox',
      'booleancheckbox',
      'calculation',
    ])
    .optional()
    .describe('Controls how the property appears in HubSpot'),
  options: z
    .array(PropertyOptionSchema)
    .optional()
    .describe('A list of valid options for enumeration properties'),
  formField: z
    .boolean()
    .optional()
    .describe('Whether the property can be used in forms'),
  hidden: z
    .boolean()
    .optional()
    .describe('Whether the property should be hidden in HubSpot'),
  displayOrder: z
    .number()
    .int()
    .optional()
    .describe(
      'The order for displaying the property (lower numbers displayed first)',
    ),
  calculationFormula: z
    .string()
    .optional()
    .describe('A formula that is used to compute a calculated property'),
});

export default UpdatePropertySchema;
