import { mainAppContainer } from "./graphics";

export function ClearElement(element?: HTMLElement): void {
  if (!element) {
    mainAppContainer.innerHTML = "";
    return;
  }

  element.innerHTML = "";
}
