export function isObjectNull(object) {
  for (const key in object) {
    if (object[key] === null) {
      return true;
    }
  }
  return false;
}
