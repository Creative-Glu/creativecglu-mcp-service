import { z } from 'zod';

export const HubspotDealCreateSchema = z.object({
  contactId: z.string().min(1, 'Contact ID is required'),
  dealname: z.string().min(1, 'Name is required'),
  amount: z.number().int().positive(),
  stage: z.string().optional(),
});

export type HubspotDealCreateDto = z.infer<typeof HubspotDealCreateSchema>;
