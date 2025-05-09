import { z } from 'zod';

export const HubspotCompanyUpdateSchema = z.object({
  companyId: z.string().min(1, 'Company ID is required'),
  name: z.string().optional(),
  domain: z.string().url().optional(),
  phone: z.string().optional(),
});

export type HubspotCompanyUpdateDto = z.infer<
  typeof HubspotCompanyUpdateSchema
>;
