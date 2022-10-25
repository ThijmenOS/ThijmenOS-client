import { ClassOperation } from "@ostypes/UtilsTypes";
import { injectable } from "inversify";
import IGraphicsUtils from "./IGraphicUtils";

@injectable()
class GraphicsUtils implements IGraphicsUtils {
  public MainAppContainer: HTMLElement = document.getElementById(
    "main-application-container"
  )!;
  public CreateElementFromHTML<T>(htmlString: string): T {
    const div = document.createElement("div");
    div.innerHTML = htmlString.trim();

    return div.firstChild as T;
  }
  public GetElementByClass<T>(element: HTMLElement, selector: string): T {
    return element.querySelector("." + selector) as T;
  }
  public AddElement(targetElement: HTMLElement, element: HTMLElement): void {
    targetElement.append(element);
  }
  public AddOrRemoveClass(
    targetElement: Array<HTMLElement>,
    classes: Array<string>,
    operation: ClassOperation
  ): void {
    if (Array.isArray(targetElement)) {
      targetElement.forEach((el) =>
        operation === ClassOperation.ADD
          ? el.classList.add(...classes)
          : el.classList.remove(...classes)
      );
      return;
    }
  }
  public WaitForElm<T>(selector: string): Promise<T> {
    // eslint-disable-next-line consistent-return
    return new Promise((resolve) => {
      if (document.getElementById(selector)) {
        return resolve(document.getElementById(selector) as T);
      }

      const observer = new MutationObserver(() => {
        if (document.getElementById(selector)) {
          resolve(document.getElementById(selector) as T);
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }
  public InitMovement(dataId: string): void {
    $(`[data-id="${dataId}"]`).draggable({
      containment: "parent",
    });
  }
}

export default GraphicsUtils;
