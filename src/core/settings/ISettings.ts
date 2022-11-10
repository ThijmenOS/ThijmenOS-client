import { ApplicationMetaData, OSSettings } from "@thijmenos/common";
import { IBackgroundOptions } from "@ostypes/Settings";

export default interface ISettings {
  get settings(): OSSettings;
  Initialise(): Promise<void>;
  DefaultApplication(mimeType: string): ApplicationMetaData | undefined;
  Background(): IBackgroundOptions;
}
