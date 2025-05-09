import { FilterType, ResponseType } from 'common/models';
import { CONTENT_TYPE } from 'common/models/Content.type';

const ContactNotFoundException = async (
  filter?: FilterType,
): Promise<ResponseType> => ({
  content: [
    {
      type: CONTENT_TYPE.TEXT,
      text: `
        No contact found matching the criteria. ${JSON.stringify(filter)}
      `,
    },
  ],
});

export default ContactNotFoundException;
