import { HUBSPOT_OBJECT_TYPES } from 'services/hubspot/models';
import z from 'zod';

export const OperatorEnum = z.enum([
  'EQ',
  'NEQ',
  'LT',
  'LTE',
  'GT',
  'GTE',
  'BETWEEN',
  'IN',
  'NOT_IN',
  'HAS_PROPERTY',
  'NOT_HAS_PROPERTY',
  'CONTAINS_TOKEN',
  'NOT_CONTAINS_TOKEN',
]);

export const FilterSchema = z.object({
  propertyName: z.string().describe('The name of the property to filter by'),
  operator: OperatorEnum.describe('The operator to use for comparison'),
  value: z.any().describe('The value to compare against. Must be a string'),
  values: z
    .array(z.any())
    .optional()
    .describe(
      'Set of string values for multi-value operators like IN and NOT_IN.',
    ),
  highValue: z.any().optional().describe(
    // eslint-disable-next-line max-len
    'The upper bound value for range operators like BETWEEN. The lower bound is specified by the value attribute',
  ),
});

export const FilterGroupSchema = z.object({
  filters: z
    .array(FilterSchema)
    .describe('Array of filters to apply (combined with AND).'),
});

export const SortSchema = z.object({
  propertyName: z.string().describe('The name of the property to sort by'),
  direction: z.enum(['ASCENDING', 'DESCENDING']).describe('The sort direction'),
});

const ObjectSearchSchema = z.object({
  objectType: z.string().describe(
    // eslint-disable-next-line max-len
    `The type of HubSpot object to search. Valid values include: ${HUBSPOT_OBJECT_TYPES.join(', ')}. For custom objects, use the hubspot-get-schemas tool to get the objectType.`,
  ),
  query: z.string().optional().describe(
    // eslint-disable-next-line max-len
    'Text to search across default searchable properties of the specified object type. Each object type has different searchable properties. For example: contacts (firstname, lastname, email, phone, company), companies (name, website, domain, phone), deals (dealname, pipeline, dealstage, description, dealtype), etc',
  ),
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10)
    .describe('The maximum number of results to display per page (max: 100).'),
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
  sorts: z
    .array(SortSchema)
    .optional()
    .describe('A list of sort criteria to apply to the results.'),
  filterGroups: z
    .array(FilterGroupSchema)
    .optional()
    .describe('Groups of filters to apply (combined with OR).'),
});

export default ObjectSearchSchema;
