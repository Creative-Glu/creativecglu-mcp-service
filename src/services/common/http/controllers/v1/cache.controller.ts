import { Delete, Get, Query } from '@nestjs/common';
import { ExtendedController } from '@yuriyempty/nestjs-extended-controller';
import { ResponseType } from 'common/models';
import { CacheService } from 'services/common/providers/services';

import { VersionControllers } from '../common.controller';

@ExtendedController({
  parent: VersionControllers.v1,
  path: 'caches',
})
class CacheController {
  constructor(private readonly cacheService: CacheService) {
    this.cacheService = cacheService;
  }

  @Get()
  async getCaches(@Query() { keyword }): Promise<ResponseType> {
    const data = await this.cacheService.allKeys(keyword);

    return { data };
  }

  @Delete()
  async deletecaches(): Promise<ResponseType> {
    await this.cacheService.clearKeys();

    return { message: 'Successfully cleared caches' };
  }
}

export default CacheController;
