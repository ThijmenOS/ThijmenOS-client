import { ApplicationMetaDataObject } from "@interface/application/applicationProperties";

export enum ClassOperation {
  ADD,
  REMOVE,
}

export interface IUtils {
  MainAppContainer: HTMLElement;
  CreateElementFromHTML<T>(htmlString: string): T;
  GetElement<T>(element: HTMLElement, selector: string): T;
  AddElement(targetElement: HTMLElement, element: HTMLElement): void;
  AddOrRemoveClass(
    targetElement: Array<HTMLElement>,
    classes: Array<string>,
    operation: ClassOperation
  ): void;
  UpdateTime(): void;
  GenerateUUID(): string;
  GetAppProperties(appLocation: string): Promise<ApplicationMetaDataObject>;
  WaitForElm<T>(selector: string): Promise<T>;
}
