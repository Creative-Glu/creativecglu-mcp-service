import z from 'zod';

const WorkflowsListSchema = z.object({
  limit: z
    .number()
    .min(1)
    .max(100)
    .optional()
    .default(20)
    .describe('The maximum number of workflows to return per page (1-100).'),
  after: z.string().optional().describe(
    // eslint-disable-next-line max-len
    'Cursor token to fetch the next page of results. Use the paging.next.after value from the previous response.',
  ),
});

export default WorkflowsListSchema;
