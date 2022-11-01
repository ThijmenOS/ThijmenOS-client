/* <Class Documentation>

  <Class Description>
    This utility class handles everything that has something to do with rendering to the DOM. 

  <Method Descriptions>
    CreateElementFromString(): This method takes a string and converts it to an html element to be displayed or to add attributes to
    GetElementByClass(): This method takes a class selector and returns the element that has that class. It also returns it as the desired html element type
    AddElement(): This method adds an element to a desired html dom element
    AddOrRemoveClass(): This method can add or remove any number of classes from elements
    WaitForElem(): This method returns a promis that waits for an element to exist on the DOM.
      |_ this is used by the SendMessageToApp() method to make sure the application is registered on the DOM
    InitMovement(): This method makes a element draggable.

*/

//DI
import { injectable } from "inversify";

//Interfaces
import IGraphicsUtils from "./IGraphicUtils";

//Types
import { ClassOperation } from "@ostypes/UtilsTypes";

@injectable()
class GraphicsUtils implements IGraphicsUtils {
  public MainAppContainer: HTMLElement = document.getElementById(
    "main-application-container"
  )!;
  public CreateElementFromString<T>(htmlString: string): T {
    const div = document.createElement("div");
    div.innerHTML = htmlString.trim();

    return div.firstChild as T;
  }
  public GetElementByClass<T>(element: HTMLElement, selector: string): T {
    return element.querySelector("." + selector) as T;
  }
  public AddElement(element: HTMLElement, targetElement?: HTMLElement): void {
    if (!targetElement) targetElement = this.MainAppContainer;
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
