import { ExtendedController } from '@yuriyempty/nestjs-extended-controller';
import { Version1Controller } from 'services/app/http/controllers';

export const PREFIX_CONTROLLER = 'contacts';

export const PREFIX_PERMISSION = 'contact';

@ExtendedController({
  parent: Version1Controller,
  path: PREFIX_CONTROLLER,
})
class ParentVersion1Controller {}

export const VersionControllers = {
  v1: ParentVersion1Controller,
};
