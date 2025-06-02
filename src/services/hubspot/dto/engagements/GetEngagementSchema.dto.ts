import z from 'zod';

const GetEngagementSchema = z.object({
  engagementId: z
    .number()
    .int()
    .positive()
    .describe('The ID of the engagement to retrieve'),
});

export default GetEngagementSchema;
