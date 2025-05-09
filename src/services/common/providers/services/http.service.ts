import { StringifyOptions } from 'querystring';

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ApiTypes } from 'common/models';
import * as qs from 'querystringify';

export const QUERY_OPTIONS = { arrayFormat: 'index' } as StringifyOptions;

@Injectable()
class HttpService {
  client: any;

  constructor() {
    this.client = axios;
  }

  get = async ({ url, params, transformer }: ApiTypes) => {
    try {
      const res = await this.client.get(
        `${url}?${qs.stringify(params, QUERY_OPTIONS)}`,
      );

      return transformer ? transformer(res) : res;
    } catch (err) {
      throw err;
    }
  };

  post = async ({ url, payload, params, transformer }: ApiTypes) => {
    try {
      const res = await this.client.post(
        `${url}?${qs.stringify(params, QUERY_OPTIONS)}`,
        payload,
      );

      return transformer ? transformer(res) : res;
    } catch (err) {
      throw err;
    }
  };
  patch = async ({ url, payload, params, transformer }: ApiTypes) => {
    try {
      const res = await this.client.patch(
        `${url}?${qs.stringify(params, QUERY_OPTIONS)}`,
        payload,
      );

      return transformer ? transformer(res) : res;
    } catch (err) {
      throw err;
    }
  };

  put = async ({ url, payload, params, transformer }: ApiTypes) => {
    try {
      const res = await this.client.put(
        `${url}?${qs.stringify(params, QUERY_OPTIONS)}`,
        payload,
      );

      return transformer ? transformer(res) : res;
    } catch (err) {
      throw err;
    }
  };

  delete = async ({ url, payload, params, transformer }: ApiTypes) => {
    try {
      const res = await this.client.delete(
        `${url}?${qs.stringify(params, QUERY_OPTIONS)}`,
        { data: payload },
      );

      return transformer ? transformer(res) : res;
    } catch (err) {
      throw err;
    }
  };
}

export default HttpService;
