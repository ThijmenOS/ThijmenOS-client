import { ClassOperation } from "@ostypes/UtilsTypes";

export default interface IGraphicsUtils {
  MainAppContainer: HTMLElement;
  CreateElementFromHTML<T>(htmlString: string): T;
  GetElementByClass<T>(element: HTMLElement, selector: string): T;
  AddElement(targetElement: HTMLElement, element: HTMLElement): void;
  AddOrRemoveClass(
    targetElement: Array<HTMLElement>,
    classes: Array<string>,
    operation: ClassOperation
  ): void;
  WaitForElm<T>(selector: string): Promise<T>;
  InitMovement(dataId: string): void;
}
