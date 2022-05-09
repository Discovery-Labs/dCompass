export default function removeNulls(obj: any): any {
  if (obj === null) {
    return undefined;
  }
  if (typeof obj === "object") {
    for (const key in obj) {
      obj[key] = removeNulls(obj[key]);
    }
  }
  return obj;
}
