import { MainAppContainer } from "./graphics";

export function ClearElement(element?: HTMLElement): void {
  if (!element) {
    MainAppContainer.innerHTML = "";
    return;
  }

  element.innerHTML = "";
}
