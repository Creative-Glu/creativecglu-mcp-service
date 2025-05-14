import { HttpException, HttpStatus } from '@nestjs/common';

export default class HttpError extends HttpException {
  constructor(data: any) {
    super(data, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
