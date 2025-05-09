import { FilterType, ResponseType } from 'common/models';
import { CONTENT_TYPE } from 'common/models/Content.type';

const StageNotFoundException = async (
  filter?: FilterType,
): Promise<ResponseType> => ({
  content: [
    {
      type: CONTENT_TYPE.TEXT,
      text: `
        No stage found matching the criteria. ${JSON.stringify(filter)}
      `,
    },
  ],
});

export default StageNotFoundException;
