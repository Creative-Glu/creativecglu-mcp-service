import { Client } from '@hubspot/api-client';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { HttpError } from 'common/exceptions';
import { ApiTypes } from 'common/models';
import * as qs from 'querystringify';

@Injectable()
export class HubspotClientV2 {
  baseUrl = 'https://api.hubspot.com';
  accessToken;
  constructor() {
    this.accessToken = process.env.HUBSPOT_API_KEY;
    if (!this.accessToken) {
      throw new Error(
        // eslint-disable-next-line max-len
        'HubSpot access token is required. Set PRIVATE_APP_ACCESS_TOKEN in your environment variables and retry.',
      );
    }
  }

  async request(path, options: Record<string, any> = {}) {
    const { method = 'GET', body, params } = options;
    // Build URL with query parameters
    let url = `${this.baseUrl}${path}`;
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      url = `${url}?${searchParams.toString()}`;
    }
    // Prepare request headers
    const requestHeaders = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      'User-Agent': `${process.env.APP_NAME}/${process.env.APP_VERSION}`,
    };
    // Prepare request options
    const requestOptions: Record<string, any> = {
      method,
      headers: requestHeaders,
    };
    // Add body for non-GET requests
    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body);
    }
    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          // eslint-disable-next-line max-len
          `HubSpot API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`,
        );
      }
      // Check if response is empty
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return await response.text();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Failed to make request to HubSpot API: ${String(error)}`,
      );
    }
  }

  async get(path, options = {}) {
    return this.request(path, { ...options, method: 'GET' });
  }
  async post(path, options = {}) {
    return this.request(path, { ...options, method: 'POST' });
  }
  async put(path, options = {}) {
    return this.request(path, { ...options, method: 'PUT' });
  }
  async delete(path, options = {}) {
    return this.request(path, { ...options, method: 'DELETE' });
  }
  async patch(path, options = {}) {
    return this.request(path, { ...options, method: 'PATCH' });
  }
}

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
