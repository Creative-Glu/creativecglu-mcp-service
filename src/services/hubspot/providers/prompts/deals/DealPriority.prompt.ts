/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Prompt } from '@rekog/mcp-nest';

@Injectable()
export default class DealPriorityPrompt {
  @Prompt({
    name: 'deal-piority-prompt',
    description: 'Sorts deals by priority based on defined criteria.',
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
              1. When the user requests deal prioritization, apply the following rules:
                - get all the deals using 'hubspot-batch-read-objects' tool with the following parameters:
                  • objectType: 'deals'
                - Sort deals starting from the bottom of the funnel (i.e., closest to conversion).
                - Exclude deals in 'closedwon' and 'closedlost' stages.
                - Prioritize based on the following criteria:
                  • Proximity to close date (sooner = higher priority)
                  • Duration spent in the current stage (longer = higher priority)
                  • Last updated timestamp (more recent = higher activity)
            `,
          },
        },
      ],
    };
  }
}
