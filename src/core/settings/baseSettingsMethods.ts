import { OSSettings } from "@thijmen-os/common";

interface BaseSettingsMethods {
  get settings(): OSSettings;
  Initialise(): Promise<void>;
}

export default BaseSettingsMethods;
