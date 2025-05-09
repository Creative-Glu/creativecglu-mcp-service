import { z } from 'zod';

export const HubspotCompanyCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  domain: z.string().url().optional(),
  phone: z.string().optional(),
});

export type HubspotCompanyCreateDto = z.infer<
  typeof HubspotCompanyCreateSchema
>;
