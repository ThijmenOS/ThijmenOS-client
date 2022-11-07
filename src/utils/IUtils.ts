import { ApplicationMetaDataObject } from "javascriptOS-common/types";

export default interface IUtils {
  UpdateTime(): void;
  GenerateUUID(): string;
  GetAppProperties(appLocation: string): Promise<ApplicationMetaDataObject>;
}
