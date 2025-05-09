import { z } from 'zod';

export const HubspotContactCreateSchema = z.object({
  firstname: z.string().min(1, 'Firstname is required'),
  lastname: z.string().min(1, 'Lastname is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  companyId: z.string().optional(),
});

export type HubspotContactCreateDto = z.infer<
  typeof HubspotContactCreateSchema
>;
