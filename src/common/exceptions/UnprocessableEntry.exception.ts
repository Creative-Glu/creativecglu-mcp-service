import { HttpException, HttpStatus } from '@nestjs/common';

export default class UnprocessableEntryException extends HttpException {
  constructor(message: string) {
    super(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message,
      },
      HttpStatus.ACCEPTED,
    );
  }
}
