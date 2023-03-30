export function GetElementByClass<T>(
  element: HTMLElement,
  selector: string
): T {
  return element.querySelector("." + selector) as T;
}
