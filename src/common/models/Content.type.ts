export enum CONTENT_TYPE {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  LINK = 'link',
  HTML = 'html',
  JSON = 'json',
  XML = 'xml',
}

export default interface ContentType {
  type: CONTENT_TYPE;

  text?: string;
}
