import ContentType from './Content.type';

export default interface ResponseType {
  message?: string;

  content?: ContentType[];

  [key: string]: any;
}
