import { z } from 'zod';

export const HubspotContactDeleteSchema = z.object({
  contactId: z.string().min(1, 'Contact ID is required'),
});

export type HubspotContactDeleteDto = z.infer<
  typeof HubspotContactDeleteSchema
>;
