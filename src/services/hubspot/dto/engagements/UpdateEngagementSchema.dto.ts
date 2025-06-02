import z from 'zod';

import { AssociationsSchema } from './CreateEngagementSchema.dto';

const UpdateEngagementSchema = z.object({
  engagementId: z
    .number()
    .int()
    .positive()
    .describe('The ID of the engagement to update'),
  ownerId: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('The ID of the owner of this engagement'),
  timestamp: z
    .number()
    .int()
    .optional()
    .describe('Timestamp for the engagement (milliseconds since epoch).'),
  metadata: z
    .object({})
    .passthrough()
    .describe('Metadata specific to the engagement type (Note or Task)'),
  associations: AssociationsSchema.describe(
    'Associated records for this engagement',
  ),
});

export default UpdateEngagementSchema;
