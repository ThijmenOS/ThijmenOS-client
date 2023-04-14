import Settings from "@core/settings/settings";
import javascriptOs from "@inversify/inversify.config";
import { EventName } from "@ostypes/ProcessTypes";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import { PermissionRequestDto } from "@thijmen-os/common";

class RevokePermissionCommand implements ICommand {
  private readonly _settings = javascriptOs.get<Settings>(types.Settings);

  private readonly _props: PermissionRequestDto;

  constructor(props: PermissionRequestDto) {
    this._props = props;
  }

  public async Handle(): Promise<CommandReturn<boolean>> {
    const application =
      this._settings.Settings.applications.installedApplications.find(
        (app) =>
          app.applicationIdentifier === this._props.applicationId.toString()
      );

    if (!application) return new CommandReturn(false, EventName.Error);

    const hasPermission = application.permissions.some(
      (permission) => permission === this._props.permission
    );

    if (!hasPermission)
      return new CommandReturn(true, EventName.PermissionRevoked);

    await this._settings.ApplicationSettings.RevokeApplicationPermission(
      this._props
    );
    await this._settings.RefreshSettings();
    return new CommandReturn<boolean>(true, EventName.PermissionRevoked);
  }
}

export default RevokePermissionCommand;
