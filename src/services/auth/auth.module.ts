import { Module } from '@nestjs/common';

import _exports from './exports';
import imports from './imports';
import providers from './providers';

@Module({
  imports,
  providers,
  exports: _exports,
})
class AuthModule {}

export default AuthModule;
