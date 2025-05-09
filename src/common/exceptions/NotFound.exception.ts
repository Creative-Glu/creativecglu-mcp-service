import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionModel } from 'services/common/models';
import { string } from 'utils';

export default class NotFoundException extends HttpException {
  constructor(props: ExceptionModel) {
    const { collection, id, message } = props;

    let errorMessage = '';

    errorMessage += `Data ${id ? `${id} ` : ''}`;

    if (collection)
      errorMessage += collection
        ? `in ${string.toTitleCase(collection)} collection `
        : '';

    errorMessage += 'not found.';

    if (message) errorMessage = message;

    super(errorMessage, HttpStatus.NOT_FOUND);
  }
}
