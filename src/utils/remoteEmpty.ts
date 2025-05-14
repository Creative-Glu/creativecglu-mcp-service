import { omitBy, isNil, isArray, isEmpty, isBoolean } from 'lodash';

const checkValue = (value: any): boolean => {
  if (isArray(value) && isEmpty(value)) return true;

  if (isBoolean(value) && value === true) return false;

  if (isEmpty(value)) return true;

  return isNil(value);
};

interface REMOVE_EMPTY {
  [key: string]: any;
}

export default function removeEmpty(obj): REMOVE_EMPTY {
  return omitBy(obj, checkValue);
}
