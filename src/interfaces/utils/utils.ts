import { PropertiesObject } from "@interface/applicationProperties";

export interface IUtils {
  CreateElementFromHTML(htmlString: string): HTMLDivElement;
  UpdateTime(): void;
  GenerateUUID(): string;
  GetAppProperties(appLocation: string): Promise<PropertiesObject>;
  WaitForElm(selector: string): Promise<HTMLElement>;
}
