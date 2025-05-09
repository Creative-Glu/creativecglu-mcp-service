import { Module } from '@nestjs/common';

import _exports from './exports';
import controllers from './http/controllers';
import imports from './imports';
import providers from './providers';

@Module({
  imports,
  controllers,
  providers,
  exports: _exports,
})
class CommonModule {}

export default CommonModule;
