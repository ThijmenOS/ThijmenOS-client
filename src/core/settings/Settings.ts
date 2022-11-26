/* <Class Documentation>

  <Class Description>
    The settings class provides methods that can lookup or manipulate the settings within the Operatig system. For example default applications or background

  <Method Descriptions>
    Initalise(): This method fetches all settings from the backend database in order to be used in the OS
    DefaultApplication(): Looks up the default application for a cetrain mimetype

*/

//DI
import { injectable } from "inversify";

//Interfaces
import { FetchSettings } from "@thijmen-os/filesystem";
import ISettings from "./ISettings";
import ErrorManager from "@thijmen-os/errormanager";

//Types
import { MimeTypes, OSSettings, ApplicationMetaData } from "@thijmen-os/common";
import BackgroundOptions from "./BackgroundOptions";
import javascriptOs from "../../../inversify.config";

@injectable()
class Settings implements ISettings {
  private _settings!: OSSettings;
  public get settings(): OSSettings {
    return this._settings;
  }

  public async Initialise(): Promise<void> {
    const settings = await FetchSettings().catch(() =>
      ErrorManager.fatalError()
    );

    if (settings) this._settings = settings;
  }

  DefaultApplication(mimeType: MimeTypes): ApplicationMetaData | undefined {
    return this._settings.apps.installedApps.find(
      (app) =>
        app.applicationIdentifier === this._settings.apps.defaultApps[mimeType]
    );
  }

  Background(): BackgroundOptions {
    return javascriptOs.resolve(BackgroundOptions);
  }
}

export default Settings;
