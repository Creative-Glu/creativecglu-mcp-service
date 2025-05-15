import { Controller, Get } from '@nestjs/common';
import c from 'common/constants';
import { ResponseType } from 'common/models';
import * as dayjs from 'dayjs';

@Controller()
export default class AppController {
  @Get()
  async index(): Promise<ResponseType> {
    const currentDate = dayjs();

    return {
      data: {
        local_timezone: `${currentDate.format(c.DATE_FORMAT)}`,
        version: process.env.APP_VERSION,
      },
      message: `Welcome to ${process.env.APP_NAME} API`,
    };
  }
}
