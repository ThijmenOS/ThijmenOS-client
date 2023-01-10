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
import ErrorManager from "@thijmen-os/errormanager";

//Types
import {
  MimeTypes,
  OSSettings,
  ApplicationMetaData,
  PermissionRequestDto,
} from "@thijmen-os/common";
import BackgroundOptions from "./individualSettings/BackgroundOptions";
import javascriptOs from "../../../inversify.config";
import SettingsMethodShape from "./settingsMethodShape";
import {
  FetchSettings,
  GrantApplicationPermission,
  RevokeAllApplicationPermissions,
  RevokeApplicationPermission,
} from "@providers/filesystemEndpoints/settings";

@injectable()
class Settings implements SettingsMethodShape {
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

  public async RefreshSettings(): Promise<void> {
    this.Initialise();
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

  public async GrantPermissionsToApplication(props: PermissionRequestDto) {
    await GrantApplicationPermission(props);
  }
  public async RevokeApplicationPermission(props: PermissionRequestDto) {
    await RevokeApplicationPermission(props);
  }
  public async RevokeAllApplicationPermissions(applicationId: string) {
    await RevokeAllApplicationPermissions(applicationId);
  }
}

export default Settings;
