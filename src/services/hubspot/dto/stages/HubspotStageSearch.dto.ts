import { z } from 'zod';

export const HubspotStageSearchSchema = z.object({
  stageId: z.string().min(1, 'Contact ID is required'),
});

export type HubspotStageSearchDto = z.infer<typeof HubspotStageSearchSchema>;
