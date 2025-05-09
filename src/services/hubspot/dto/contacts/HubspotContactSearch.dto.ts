import { z } from 'zod';

export const HubspotContactSearchSchema = z.object({
  limit: z.number().int().positive().optional(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
});

export type HubspotContactSearchDto = z.infer<
  typeof HubspotContactSearchSchema
>;

export const HubspotContactSearchV2Schema = z.object({
  contactId: z.string().min(1, 'Contact ID is required'),
});

export type HubspotContactSearchV2Dto = z.infer<
  typeof HubspotContactSearchV2Schema
>;
