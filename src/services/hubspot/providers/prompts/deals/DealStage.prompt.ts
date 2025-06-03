/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Prompt } from '@rekog/mcp-nest';

const description = `
  ## Notes

  When creating or updating deal stages:
  - If the stage is 'Appointment Scheduled', set closeAt to current date + 1 month
  - If the stage is 'Qualified To Buy', set closeAt to current date + 3 weeks
  - If the stage is 'Presentation Scheduled', set closeAt to current date + 1 week
  - If the stage is not one of the above, do not set closeAt
`;

@Injectable()
export default class DealStagePrompt {
  @Prompt({
    name: 'deal-stage-prompt',
    description,
  })
  async process() {
    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: description,
          },
        },
      ],
    };
  }
}
