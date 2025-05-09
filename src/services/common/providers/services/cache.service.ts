import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import c from 'common/constants';

export interface CACHE {
  key: string;
  data: any;
  type?: 'boolean' | 'object' | 'string' | 'number';
}
export interface CACHE_OPTIONS {
  ttl?: number;
}

@Injectable()
class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.cacheManager = cacheManager;
  }

  async setCache({ key, data }: CACHE, options: CACHE_OPTIONS): Promise<void> {
    const type = typeof data;

    await this.cacheManager.set(
      key,
      JSON.stringify({ data, type }),
      options?.ttl ?? c.CACHE_TTL,
    );
  }

  async setCaches({ key, data }: CACHE, options: CACHE_OPTIONS): Promise<void> {
    const caches = (await this.cacheManager.store.keys()).filter((_key) =>
      _key.toLocaleLowerCase().includes(key.toLocaleLowerCase()),
    );

    const type = typeof data;

    for (let i = 0; i < caches.length; i++)
      await this.cacheManager.set(
        caches[i],
        JSON.stringify({ data, type }),
        options?.ttl ?? c.CACHE_TTL,
      );
  }

  async getCache(
    key: string,
    callback: (e: any) => Promise<any>,
    options?: CACHE_OPTIONS,
  ): Promise<CACHE> {
    const cache: string = await this.cacheManager.get(key);

    if (!cache) {
      const data = await callback(key);

      await this.setCache({ key, data }, options as CACHE_OPTIONS);

      return data;
    }

    return JSON.parse(cache).data;
  }

  async getCaches(key: string): Promise<CACHE[]> {
    const caches = (await this.cacheManager.store.keys()).filter((_key) =>
      _key.toLocaleLowerCase().includes(key.toLocaleLowerCase()),
    );

    const result: CACHE[] = [];

    for (let i = 0; i < caches.length; i++) {
      result.push({
        key,
        data: await this.cacheManager.get(caches[i]),
      });
    }

    return result;
  }

  async resetCache(
    key: string,
    callback: (e: any) => Promise<any>,
  ): Promise<CACHE> {
    const data = await callback(key);

    await this.cacheManager.del(key);

    return data;
  }

  async resetCaches(
    key: string | string[],
    callback: (e: any) => Promise<any>,
  ): Promise<CACHE[]> {
    const data = await callback(key);

    let caches = [];

    if (typeof key === 'object') {
      for (const __key of key) {
        caches = [
          ...caches,
          ...(await (
            await this.cacheManager.store.keys()
          ).filter((_key) =>
            _key.toLocaleLowerCase().includes(__key.toLocaleLowerCase()),
          )),
        ];
      }
    } else {
      caches = (await this.cacheManager.store.keys()).filter((_key) =>
        _key.toLocaleLowerCase().includes(key.toLocaleLowerCase()),
      );
    }

    for (let i = 0; i < caches.length; i++)
      await this.cacheManager.del(caches[i]);

    return data;
  }

  async allKeys(string = ''): Promise<string[]> {
    return (await this.cacheManager.store.keys()).filter((_key) =>
      _key.toLocaleLowerCase().includes(string.toLocaleLowerCase()),
    );
  }

  async clearKeys(): Promise<void> {
    await this.cacheManager.reset();
  }

  async deleteCache(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}

export default CacheService;
