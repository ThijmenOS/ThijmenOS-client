//TODO: On prod, make dynamic
export function NormalisePath(path: string) {
  const basePath = "http://localhost:8080/static/";
  return basePath + path;
}
