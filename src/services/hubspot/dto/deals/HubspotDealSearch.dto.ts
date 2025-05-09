import { z } from 'zod';

export const HubspotDealSearchSchema = z.object({
  limit: z.number().int().positive().optional(),
  name: z.string().optional(),
  stage: z.string().optional(),
});

export type HubspotDealSearchDto = z.infer<typeof HubspotDealSearchSchema>;

export const HubspotDealSearchV2Schema = z.object({
  dealId: z.string().min(1, 'Deal ID is required'),
});

export type HubspotDealSearchV2Dto = z.infer<typeof HubspotDealSearchV2Schema>;
