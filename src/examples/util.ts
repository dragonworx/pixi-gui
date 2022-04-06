export function getQueryParameters() {
  const search = location.search.substring(1);
  if (search === '') {
    return {};
  }
  const urlParams = new URLSearchParams(search);
  const obj: any = {};
  urlParams.forEach((v, k) => {
    let value: any = v;
    if (String(parseFloat(value)) === v) {
      value = parseFloat(value);
    }
    obj[k] = value;
  });
  return obj;
}

export const query = getQueryParameters();
