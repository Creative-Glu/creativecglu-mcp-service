import { FilterType, ResponseType } from 'common/models';
import { CONTENT_TYPE } from 'common/models/Content.type';

const StageUnableToPrcocessEntryException = async (
  filter?: FilterType,
): Promise<ResponseType> => ({
  content: [
    {
      type: CONTENT_TYPE.TEXT,
      text: `
        Unable to move deal and stage. ${JSON.stringify(filter)}
      `,
    },
  ],
});

export default StageUnableToPrcocessEntryException;
