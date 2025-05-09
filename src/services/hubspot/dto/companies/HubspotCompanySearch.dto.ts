import { z } from 'zod';

export const HubspotCompanySearchSchema = z.object({
  limit: z.number().int().positive().optional(),
  name: z.string().optional(),
  domain: z.string().optional(),
  phone: z.string().optional(),
});

export type HubspotCompanySearchDto = z.infer<
  typeof HubspotCompanySearchSchema
>;

export const HubspotCompanySearchV2Schema = z.object({
  companyId: z.string().min(1, 'Company ID is required'),
});

export type HubspotCompanySearchV2Dto = z.infer<
  typeof HubspotCompanySearchV2Schema
>;
