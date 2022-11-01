/* <Class Documentation>

  <Class Description>
    The settings class provides methods that can lookup or manipulate the settings within the Operatig system. For example default applications or background

  <Method Descriptions>
    Initalise(): This method fetches all settings from the backend database in order to be used in the OS
    DefaultApplication(): Looks up the default application for a cetrain mimetype

*/

//DI
import { inject, injectable } from "inversify";
import types from "@ostypes/types";

//Interfaces
import IFileSystem from "@drivers/fileSystem/IFileSystem";
import ISettings from "./ISettings";

//Types
import { ApplicationMetaData } from "@ostypes/ApplicationTypes";
import { MimeTypes, OSSettings } from "@ostypes/SettingsTypes";

@injectable()
class Settings implements ISettings {
  private readonly _fileSystem: IFileSystem;

  private _settings!: OSSettings;
  public get settings(): OSSettings {
    return this._settings;
  }

  constructor(@inject(types.FileSystem) fileSystem: IFileSystem) {
    this._fileSystem = fileSystem;
  }

  public async Initialise(): Promise<void> {
    //TODO: If the settings could not be fetched. Throw blue screen
    this._settings = await this._fileSystem.FetchSettings();
  }
  DefaultApplication(mimeType: MimeTypes): ApplicationMetaData | undefined {
    return this._settings.apps.installedApps.find(
      (app) =>
        app.applicationIdentifier === this._settings.apps.defaultApps[mimeType]
    );
  }
}

export default Settings;
