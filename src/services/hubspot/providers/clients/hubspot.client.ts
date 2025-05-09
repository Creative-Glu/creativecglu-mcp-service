import { Client } from '@hubspot/api-client';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { HttpError } from 'common/exceptions';
import { ApiTypes } from 'common/models';
import * as qs from 'querystringify';

@Injectable()
export default class HubspotClient {
  client: any;
  private http: any;

  constructor() {
    this.client = new Client({
      accessToken: process.env.HUBSPOT_API_KEY,
    });

    this.http = axios.create({
      baseURL: 'https://api.hubapi.com',
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
  }

  get = async ({ url, params, transformer }: ApiTypes) => {
    try {
      const res = await this.http.get(`${url}?${qs.stringify(params)}`);

      return transformer ? transformer(res?.data) : res?.data;
    } catch (err) {
      throw new HttpError(err);
    }
  };

  post = async ({ url, payload, params, transformer }: ApiTypes) => {
    try {
      const res = await this.http.post(
        `${url}?${qs.stringify(params)}`,
        payload,
      );

      return transformer ? transformer(res?.data) : res?.data;
    } catch (err) {
      throw new HttpError(err);
    }
  };

  put = async ({ url, payload, params, transformer }: ApiTypes) => {
    try {
      const res = await this.http.put(
        `${url}?${qs.stringify(params)}`,
        payload,
      );

      return transformer ? transformer(res?.data) : res?.data;
    } catch (err) {
      throw new HttpError(err);
    }
  };

  patch = async ({ url, payload, params, transformer }: ApiTypes) => {
    try {
      const res = await this.http.patch(
        `${url}?${qs.stringify(params)}`,
        payload,
      );

      return transformer ? transformer(res?.data) : res?.data;
    } catch (err) {
      throw new HttpError(err);
    }
  };

  delete = async ({ url, params, payload, transformer }: ApiTypes) => {
    try {
      const res = await this.http.delete(`${url}?${qs.stringify(params)}`, {
        data: payload,
      });

      return transformer ? transformer(res?.data) : res?.data;
    } catch (err) {
      throw new HttpError(err);
    }
  };
}
