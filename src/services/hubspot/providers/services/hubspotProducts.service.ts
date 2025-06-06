import { Injectable, NotFoundException } from '@nestjs/common';
import { isEmpty } from 'class-validator';
import { UnprocessableEntryException } from 'common/exceptions';
import { ResponseType } from 'common/models';
import {
  HubspotProductSearchDto,
  HubspotProductSearchV2Dto,
} from 'services/hubspot/dto';

import { HubspotClient } from '../clients';

@Injectable()
export default class HubspotProductService {
  constructor(private readonly hubspotClient: HubspotClient) {}

  async getProducts(filter: HubspotProductSearchDto): Promise<ResponseType> {
    try {
      const { name, perPage } = filter;

      const response =
        await this.hubspotClient.client.crm.products.basicApi.getPage();

      let data = response.results
        .filter((product: any) => {
          if (!isEmpty(name))
            return product.properties?.name
              ?.toLowerCase()
              .includes(name.toLowerCase());
          return true;
        })
        .map((product: any) => ({
          productId: product.id,
          ...product,
        }));

      if (perPage && Number.isInteger(perPage) && perPage > 0)
        data = data.slice(0, perPage);

      return {
        data,
        meta: { total: response.total },
      };
    } catch (err) {
      throw new UnprocessableEntryException(err?.body?.message ?? err?.message);
    }
  }

  async getProductById({
    productId,
  }: HubspotProductSearchV2Dto): Promise<ResponseType> {
    try {
      const product =
        await this.hubspotClient.client.crm.products.basicApi.getById(
          productId,
        );

      return { data: { productId: product.id, ...product } };
    } catch (err) {
      if ([404, 400].includes(err.code))
        throw new NotFoundException({
          collection: 'product',
          id: productId,
        });

      throw new UnprocessableEntryException(err?.body?.message ?? err?.message);
    }
  }
}
