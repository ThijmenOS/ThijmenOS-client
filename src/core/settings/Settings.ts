import IFileSystem from "@drivers/fileSystem/IFileSystem";
import { ApplicationMetaData } from "@ostypes/ApplicationTypes";
import { MimeTypes, OSSettings } from "@ostypes/SettingsTypes";
import types from "@ostypes/types";
import { inject, injectable } from "inversify";
import ISettings from "./ISettings";

@injectable()
class Settings implements ISettings {
  private readonly _fileSystem: IFileSystem;

  private _settings!: OSSettings;
  public get settings(): OSSettings {
    return this._settings;
  }

  constructor(@inject(types.FileSystem) fileSystem: IFileSystem) {
    this._fileSystem = fileSystem;

    this.Initialise();
  }

  public async Initialise(): Promise<void> {
    this._settings = await this._fileSystem.FetchSettings();
  }
  DefaultApplication(mimeType: MimeTypes): ApplicationMetaData {
    return this._settings?.apps.defaultApps[mimeType];
  }
}

export default Settings;
