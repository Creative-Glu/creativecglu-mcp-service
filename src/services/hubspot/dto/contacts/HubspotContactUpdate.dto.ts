import { z } from 'zod';

export const HubspotContactUpdateSchema = z.object({
  contactId: z.string().min(1, 'Contact ID is required'),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().optional(),
  companyId: z.string().optional(),
});

export type HubspotContactUpdateDto = z.infer<
  typeof HubspotContactUpdateSchema
>;
