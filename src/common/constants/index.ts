const INTERVAL = 1 /* secs */ * 1000;
const CACHE_TTL = 10 /* secs */ * 1000;
const MAX_STRING = 1000;
const MAX_PER_PAGE = 99999999;
const MAX_LISTENERS = 9999;

const PER_PAGE = 20;
const PAGE = 12;

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const DIR_PATH = `${process.cwd()}/src/files`;

export default {
  PER_PAGE,
  PAGE,
  MAX_PER_PAGE,
  MAX_LISTENERS,
  MAX_STRING,
  INTERVAL,
  CACHE_TTL,
  DATE_FORMAT,
  DIR_PATH,
};
