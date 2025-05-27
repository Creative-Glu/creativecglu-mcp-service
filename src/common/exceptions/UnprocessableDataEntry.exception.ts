import { HttpException, HttpStatus } from '@nestjs/common';

export default class UnprocessableDataEntryException extends HttpException {
  constructor(data: any) {
    super(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: data,
      },
      HttpStatus.ACCEPTED,
    );
  }
}
