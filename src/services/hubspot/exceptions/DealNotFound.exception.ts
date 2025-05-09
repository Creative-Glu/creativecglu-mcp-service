import { FilterType, ResponseType } from 'common/models';
import { CONTENT_TYPE } from 'common/models/Content.type';

const DealNotFoundException = async (
  filter?: FilterType,
): Promise<ResponseType> => ({
  content: [
    {
      type: CONTENT_TYPE.TEXT,
      text: `
        No deal found matching the criteria. ${JSON.stringify(filter)}
      `,
    },
  ],
});

export default DealNotFoundException;
