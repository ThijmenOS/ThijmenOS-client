import { MainAppContainer } from "./graphics";

export function AddElement(
  element: HTMLElement,
  targetElement?: HTMLElement
): void {
  if (!targetElement) targetElement = MainAppContainer;
  targetElement.append(element);
}
