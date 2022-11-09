import { ApplicationMetaDataObject } from "@thijmenos/common/types";

export default interface IUtils {
  UpdateTime(): void;
  GenerateUUID(): string;
  GetAppProperties(appLocation: string): Promise<ApplicationMetaDataObject>;
}
