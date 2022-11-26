import { ApplicationMetaData, OSSettings } from "@thijmen-os/common";
import { IBackgroundOptions } from "./IBackgroundOptions";

export default interface ISettings {
  get settings(): OSSettings;
  Initialise(): Promise<void>;
  DefaultApplication(mimeType: string): ApplicationMetaData | undefined;
  Background(): IBackgroundOptions;
}
