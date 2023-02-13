import Settings from "@core/settings/settings";
import javascriptOs from "@inversify/inversify.config";
import { EventName } from "@ostypes/AppManagerTypes";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";

class RevokeAllPermissionCommand implements ICommand {
  private readonly _settings = javascriptOs.get<Settings>(types.Settings);

  private readonly applicationId: string;

  constructor(applicationId: string) {
    this.applicationId = applicationId;
  }

  public async Handle(): Promise<CommandReturn<boolean>> {
    const application =
      this._settings.settings.applications.installedApplications.find(
        (app) => app.applicationIdentifier === this.applicationId.toString()
      );

    if (!application) return new CommandReturn(false, EventName.Error);

    await this._settings.ApplicationSettings.RevokeAllApplicationPermissions(
      this.applicationId
    );
    await this._settings.RefreshSettings();
    return new CommandReturn<boolean>(true, EventName.PermissionRevoked);
  }
}

export default RevokeAllPermissionCommand;
