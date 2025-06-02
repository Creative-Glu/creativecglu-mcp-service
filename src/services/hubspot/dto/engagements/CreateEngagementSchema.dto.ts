import z from 'zod';

export const ENGAGEMENT_TYPES = ['NOTE', 'TASK'] as const;

export const NoteMetadataSchema = z.object({
  body: z.string().describe('The content of the note'),
});

export const TaskMetadataSchema = z.object({
  body: z.string().describe('The body/description of the task'),
  subject: z.string().describe('The title/subject of the task'),
  status: z
    .enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'WAITING'])
    .default('NOT_STARTED'),
  forObjectType: z
    .enum(['CONTACT', 'COMPANY', 'DEAL', 'TICKET'])
    .default('CONTACT'),
});

export const AssociationsSchema = z.object({
  contactIds: z.array(z.number().int()).optional().default([]),
  companyIds: z.array(z.number().int()).optional().default([]),
  dealIds: z.array(z.number().int()).optional().default([]),
  ownerIds: z.array(z.number().int()).optional().default([]),
  ticketIds: z.array(z.number().int()).optional().default([]),
});

export const metadataSchemas = {
  NOTE: NoteMetadataSchema,
  TASK: TaskMetadataSchema,
};

const CreateEngagementSchema = z
  .object({
    type: z
      .enum(ENGAGEMENT_TYPES)
      .describe('The type of engagement to create (NOTE or TASK)'),
    ownerId: z
      .number()
      .int()
      .positive()
      .describe('The ID of the owner of this engagement'),
    timestamp: z.number().int().optional().describe(
      // eslint-disable-next-line max-len
      'Timestamp for the engagement (milliseconds since epoch). Defaults to current time if not provided.',
    ),
    associations: AssociationsSchema.describe(
      'Associated records for this engagement',
    ),
    metadata: z
      .object({})
      .passthrough()
      .describe('Metadata specific to the engagement type'),
  })
  .superRefine((data, ctx) => {
    const schema = metadataSchemas[data.type];
    if (!schema) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Unsupported engagement type: ${data.type}`,
        path: ['type'],
      });
      return;
    }
    const result = schema.safeParse(data.metadata);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        ctx.addIssue({
          ...issue,
          path: ['metadata', ...(issue.path || [])],
        });
      });
    }
  });

export default CreateEngagementSchema;
