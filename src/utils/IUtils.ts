import { ApplicationMetaDataObject } from "@common/Application";

export default interface IUtils {
  UpdateTime(): void;
  GenerateUUID(): string;
  GetAppProperties(appLocation: string): Promise<ApplicationMetaDataObject>;
}
