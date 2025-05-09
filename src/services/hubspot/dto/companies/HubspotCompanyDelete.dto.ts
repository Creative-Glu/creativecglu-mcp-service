import { z } from 'zod';

export const HubspotCompanyDeleteSchema = z.object({
  companyId: z.string().min(1, 'Company ID is required'),
});

export type HubspotCompanyDeleteDto = z.infer<
  typeof HubspotCompanyDeleteSchema
>;
