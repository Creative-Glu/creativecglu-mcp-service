import { HUBSPOT_OBJECT_TYPES } from 'services/hubspot/models';
import z from 'zod';

export const PropertyOptionSchema = z.object({
  label: z.string().describe('The human-readable label for the option'),
  value: z
    .string()
    .describe(
      'The internal value for the option, which must be used when setting the property value',
    ),
  description: z
    .string()
    .optional()
    .describe('A description of what the option represents'),
  displayOrder: z
    .number()
    .int()
    .optional()
    .describe(
      'The order for displaying the option (lower numbers displayed first)',
    ),
  hidden: z
    .boolean()
    .optional()
    .describe('Whether the option should be hidden in HubSpot'),
});

const CreatePropertySchema = z.object({
  objectType: z.string().describe(
    // eslint-disable-next-line max-len
    `The type of HubSpot object to create the property for. Valid values include: ${HUBSPOT_OBJECT_TYPES.join(', ')}. For custom objects, use the hubspot-get-schemas tool to get the objectType.`,
  ),
  name: z
    .string()
    .describe(
      'The internal property name, which must be used when referencing the property via the API',
    ),
  label: z
    .string()
    .describe('A human-readable property label that will be shown in HubSpot'),
  description: z
    .string()
    .optional()
    .describe('A description of the property that will be shown as help text'),
  groupName: z
    .string()
    .describe('The name of the property group the property belongs to'),
  type: z
    .enum(['string', 'number', 'date', 'datetime', 'enumeration', 'bool'])
    .default('string')
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
    .default('text')
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
  hasUniqueValue: z
    .boolean()
    .optional()
    .describe("Whether the property's value must be unique"),
  calculationFormula: z
    .string()
    .optional()
    .describe('A formula that is used to compute a calculated property'),
  externalOptions: z.boolean().optional().describe(
    // eslint-disable-next-line max-len
    'Only for enumeration type properties. Should be set to true in conjunction with a referencedObjectType',
  ),
});

export default CreatePropertySchema;
