import { HUBSPOT_OBJECT_TYPES } from 'services/hubspot/models';
import z from 'zod';

const GetPropertySchema = z.object({
  objectType: z.string().describe(
    // eslint-disable-next-line max-len
    `The type of HubSpot object the property belongs to. Valid values include: ${HUBSPOT_OBJECT_TYPES.join(', ')}. For custom objects, use the hubspot-get-schemas tool to get the objectType.`,
  ),
  propertyName: z.string().describe('The name of the property to retrieve'),
});

export default GetPropertySchema;
