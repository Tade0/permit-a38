export function sanitize(pathQuery: string) {
  return pathQuery.replace(/[\n\r]+\s*/g, '');
}
