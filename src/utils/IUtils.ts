import { ApplicationMetaDataObject } from "@ostypes/ApplicationTypes";

export default interface IUtils {
  UpdateTime(): void;
  GenerateUUID(): string;
  GetAppProperties(appLocation: string): Promise<ApplicationMetaDataObject>;
}
