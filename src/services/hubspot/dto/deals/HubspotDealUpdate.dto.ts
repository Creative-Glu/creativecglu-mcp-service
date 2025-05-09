import { z } from 'zod';

export const HubspotDealUpdateSchema = z.object({
  dealId: z.string().min(1, 'Deal ID is required'),
  dealname: z.string().optional(),
  amount: z.number().int().positive().optional(),
  stage: z.string().optional(),
});

export type HubspotDealUpdateDto = z.infer<typeof HubspotDealUpdateSchema>;
