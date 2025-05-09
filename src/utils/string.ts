export function toTitleCase(string) {
  const chars = string.split('');

  return chars
    .map((char: string, key: number): string =>
      key <= 0 ? char.toUpperCase() : char,
    )
    .join('');
}

export function parseStringBetween(string: string, start: string, end: string) {
  return (
    string
      ?.match(new RegExp(`${start}(.*?)${end}`, 'g'))
      ?.map((str) =>
        str.substring(str.indexOf(start) + 1, str.lastIndexOf(end)),
      ) ?? []
  );
}

interface Values {
  [key: string]: string;
}

export function stripStrings(
  values: Values,
  string: string,
  start: string,
  end: string,
) {
  Object.entries(values).forEach(([key, value]) => {
    string = string.replace(`${start}${key}${end}`, value);
  });

  return string;
}

export default { toTitleCase, parseStringBetween, stripStrings };
