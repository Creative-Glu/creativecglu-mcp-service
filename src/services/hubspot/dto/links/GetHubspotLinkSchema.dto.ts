import z from 'zod';

export const PageTypeEnum = z
  .enum(['record', 'index'])
  .describe(
    "The type of page to link to: 'record' for a specific object's page, 'index' for a list page",
  );

export const PageRequestSchema = z.object({
  pagetype: PageTypeEnum,
  objectTypeId: z.string().describe(
    // eslint-disable-next-line max-len
    "The HubSpot object type ID to link to (e.g., '0-1', '0-2' for contacts, companies, or '2-x' for custom objects)",
  ),
  objectId: z
    .string()
    .optional()
    .describe(
      "The specific object ID to link to (required for 'record' page types)",
    ),
});

const GetHubspotLinkSchema = z.object({
  portalId: z.string().describe('The HubSpot portal/account ID'),
  uiDomain: z
    .string()
    .describe("The HubSpot UI domain(e.g., 'app.hubspot.com')"),
  pageRequests: z
    .array(PageRequestSchema)
    .describe('Array of page link requests to generate'),
});

export default GetHubspotLinkSchema;
