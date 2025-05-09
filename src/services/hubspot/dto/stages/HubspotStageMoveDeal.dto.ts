import { z } from 'zod';

export const HubspotStageMoveDealSchema = z.object({
  dealId: z.string().min(1, 'Deal ID is required'),
  stageId: z.string().min(1, 'Stage ID is required'),
});

export type HubspotStageMoveDealDto = z.infer<
  typeof HubspotStageMoveDealSchema
>;
