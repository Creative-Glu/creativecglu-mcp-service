/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { removeEmpty } from 'utils';
import { z } from 'zod';

import { HubspotContactService } from '../services';

@Injectable()
export default class HubspotGetContactTool {
  constructor(private readonly hubspotContactService: HubspotContactService) {
    this.hubspotContactService = hubspotContactService;
  }

  @Tool({
    name: 'get-contacts',
    description: `
      ### get-contacts

      ---

      **Purpose**  
      List or search contacts.

      ---

      **Optional filters**  
      'perPage' · 'firstname' · 'lastname' · 'phone' · 'email'  
      (omit empty fields, AND logic, case-insensitive; URL-encode phone/email)

      ---

      **Defaults & rules**  
      - No filters → paginated list, 'perPage' **200** if user requests “all”.  
      - Return unique, sorted, readable results.

      ---

      **Compound flow**  
      1 ► get-companies “Acme Corp” → companyId  
      2 ► get-contacts {companyId, phone:not null}

      ---

      **Natural commands**  
      “Show me all contacts” · “Find john@example.com” · “List contacts named Sarah” · “Contacts with 555-1234”

      ---

      **Example payload**
      '''json
      {
        "perPage": 200,
        "firstname": "John",
        "lastname": "Doe",
        "phone": "+12125554321",
        "email": "john.doe@example.com"
      }

    `,
    parameters: z.object({
      perPage: z.number().optional(),
    }),
  })
  async getContacts({ perPage }) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            await this.hubspotContactService.getContacts(
              removeEmpty({ perPage }),
            ),
            null,
            2,
          ),
        },
      ],
    };
  }
}
