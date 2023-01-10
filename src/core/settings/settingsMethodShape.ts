import { ApplicationMetaData, OSSettings } from "@thijmen-os/common";
import BackgroundSettingsMethodShape from "./individualSettings/backgroundSettingsMethodShape";

export default interface Settings {
  get settings(): OSSettings;
  Initialise(): Promise<void>;
  RefreshSettings(): Promise<void>;
  DefaultApplication(mimeType: string): ApplicationMetaData | undefined;
  Background(): BackgroundSettingsMethodShape;
}
