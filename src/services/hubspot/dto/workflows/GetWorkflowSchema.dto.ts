import z from 'zod';

const GetWorkflowSchema = z.object({
  flowId: z.string().describe('The ID of the workflow to retrieve'),
});

export default GetWorkflowSchema;
