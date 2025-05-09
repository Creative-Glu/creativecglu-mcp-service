import { z } from 'zod';

export const HubspotDealDeleteSchema = z.object({
  dealId: z.string().min(1, 'Deal ID is required'),
});

export type HubspotDealDeleteDto = z.infer<typeof HubspotDealDeleteSchema>;
