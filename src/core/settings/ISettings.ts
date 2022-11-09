import { ApplicationMetaData, OSSettings } from "javascriptOS-common/types";
import { IBackgroundOptions } from "@ostypes/Settings";

export default interface ISettings {
  get settings(): OSSettings;
  Initialise(): Promise<void>;
  DefaultApplication(mimeType: string): ApplicationMetaData | undefined;
  Background(): IBackgroundOptions;
}
