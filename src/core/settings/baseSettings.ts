import { FetchSettings } from "@providers/filesystemEndpoints/settings";
import { OSSettings } from "@thijmen-os/common";
import ErrorManager from "@thijmen-os/errormanager";
import { injectable } from "inversify";
import BaseSettingsMethods from "./baseSettingsMethods";

@injectable()
class BaseSettings implements BaseSettingsMethods {
  protected _settings!: OSSettings;
  public get Settings(): OSSettings {
    return this._settings;
  }

  public async Initialise(): Promise<void> {
    const settings = await FetchSettings().catch(() =>
      ErrorManager.fatalError()
    );

    if (settings) this._settings = settings;
  }
}

export default BaseSettings;
