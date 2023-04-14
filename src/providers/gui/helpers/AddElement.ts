import { mainAppContainer } from "./graphics";

export function AddElement(
  element: HTMLElement,
  targetElement?: HTMLElement
): void {
  if (!targetElement) targetElement = mainAppContainer;
  targetElement.append(element);
}
