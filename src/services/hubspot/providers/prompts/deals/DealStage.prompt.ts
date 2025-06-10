/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Prompt } from '@rekog/mcp-nest';

@Injectable()
export default class DealStagePrompt {
  @Prompt({
    name: 'deal-stage-prompt',
    description: `Use when a deal's stage is assigned or updated. Manages stage transitions accordingly.`,
  })
  async process() {
    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `
              📖 Instructions:
                1. When creating or updating the stage of a deal:
                  - If the stage is 'appointmentscheduled', set closeAt to the current date + 1 month.
                  - If the stage is 'qualifiedtobuy', set closeAt to the current date + 3 weeks.  
                    Use the 'create-proposal' tool to create a proposal.
                  - If the stage is 'presentationscheduled', set closeAt to the current date + 1 week.
                  - If the stage is not one of the above, do not set closeAt.
            `,
          },
        },
      ],
    };
  }
}
