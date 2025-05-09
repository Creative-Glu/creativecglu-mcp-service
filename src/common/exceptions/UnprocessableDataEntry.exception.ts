import { HttpException, HttpStatus } from '@nestjs/common';

export default class UnprocessableDataEntryException extends HttpException {
  constructor(data: any) {
    super(data, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
