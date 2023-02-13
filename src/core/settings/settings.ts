//DI
import { injectable } from "inversify";

//Interfaces

//Types
import { MimeTypes, ApplicationMetaData } from "@thijmen-os/common";
import SettingsMethodShape from "./settingsMethodShape";
import BaseSettings from "./baseSettings";
import javascriptOs from "@inversify/inversify.config";
import ApplicationSettings from "./individualSettings/applicationSettings";

@injectable()
class Settings extends BaseSettings implements SettingsMethodShape {
  public async RefreshSettings(): Promise<void> {
    this.Initialise();
  }

  DefaultApplication(mimeType: MimeTypes): ApplicationMetaData | undefined {
    return this._settings.applications.installedApplications.find(
      (app) =>
        app.applicationIdentifier ===
        this._settings.applications.defaultApplications[mimeType]
    );
  }

  public get ApplicationSettings() {
    return javascriptOs.resolve<ApplicationSettings>(ApplicationSettings);
  }
}

export default Settings;
