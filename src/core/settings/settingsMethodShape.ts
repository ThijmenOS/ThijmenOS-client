import { ApplicationMetaData } from "@thijmen-os/common";
import BaseSettingsMethods from "./baseSettingsMethods";
import ApplicationSettings from "./individualSettings/applicationSettings";

export default interface Settings extends BaseSettingsMethods {
  RefreshSettings(): Promise<void>;
  DefaultApplication(mimeType: string): ApplicationMetaData | undefined;
  get ApplicationSettings(): ApplicationSettings;
}
