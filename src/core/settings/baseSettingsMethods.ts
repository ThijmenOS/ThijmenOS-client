import { OSSettings } from "@thijmen-os/common";

interface BaseSettingsMethods {
  get Settings(): OSSettings;
  Initialise(): Promise<void>;
}

export default BaseSettingsMethods;
