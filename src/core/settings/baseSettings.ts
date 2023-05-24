import { FetchSettings } from "@providers/filesystemEndpoints/settings";
import { OSSettings } from "@thijmen-os/common";
import { injectable } from "inversify";
import BaseSettingsMethods from "./baseSettingsMethods";
import FatalError from "@providers/error/userErrors/fatalError";
import { errors } from "@core/kernel/commands/errors";

@injectable()
class BaseSettings implements BaseSettingsMethods {
  protected _settings!: OSSettings;
  public get Settings(): OSSettings {
    return this._settings;
  }

  public async Initialise(): Promise<void> {
    const settings = await FetchSettings().catch(() => {
      throw new FatalError(
        "Could not fetch settings",
        errors.SettingsCouldNotLoad
      );
    });

    if (settings) this._settings = settings;
  }
}

export default BaseSettings;
