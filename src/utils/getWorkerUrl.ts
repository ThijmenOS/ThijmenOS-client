export function GetWorkerURL(url: string) {
  const content = `import "${url}";`;
  return URL.createObjectURL(new Blob([content], { type: "text/javascript" }));
}
