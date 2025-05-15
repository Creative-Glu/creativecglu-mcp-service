import { Controller, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ExtendedController } from '@yuriyempty/nestjs-extended-controller';
import { BasicAuthGuard } from 'services/auth/providers/guards';

import AppController from './app.controller';

export { AppController };

@UseGuards(ThrottlerGuard, BasicAuthGuard)
@Controller('api')
class _AppController {}

@ExtendedController({
  parent: _AppController,
  path: 'v1',
})
export class Version1Controller {}

@ExtendedController({
  parent: _AppController,
  path: 'v2',
})
export class Version2Controller {}

export default [AppController];
