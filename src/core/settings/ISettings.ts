import { ApplicationMetaData } from "@ostypes/ApplicationTypes";
import { OSSettings } from "@ostypes/SettingsTypes";

export default interface ISettings {
  get settings(): OSSettings;
  Initialise(): Promise<void>;
  DefaultApplication(mimeType: string): ApplicationMetaData | undefined;
}
