import Settings from "@core/settings/settings";
import javascriptOs from "@inversify/inversify.config";
import { EventName } from "@ostypes/AppManagerTypes";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import { Permissions } from "@thijmen-os/common";
import { GrantPermission } from "@thijmen-os/prompt";

class AskPermissionCommand implements ICommand {
  private readonly _settings = javascriptOs.get<Settings>(types.Settings);

  private readonly requestedPermission: Permissions;

  constructor(props: Permissions) {
    this.requestedPermission = props;
  }

  public async Handle(applicationId: string): Promise<CommandReturn<boolean>> {
    const application = this._settings.settings.apps.installedApps.find(
      (app) => app.applicationIdentifier === applicationId.toString()
    );

    if (!application) return new CommandReturn(false, EventName.Error);

    const permissionAlreadyGranted = application.permissions.some(
      (permission) => permission === this.requestedPermission
    );

    if (permissionAlreadyGranted)
      return new CommandReturn(true, EventName.PermissionGranted);

    const userInteraction = new Promise((resolve) => {
      new GrantPermission(
        this.requestedPermission,
        applicationId,
        application!.name,
        (res: boolean): void => {
          resolve(res);
        }
      );
    });

    const granted = await userInteraction;
    if (!granted) {
      return new CommandReturn<boolean>(false, EventName.PermissionNotGranted);
    }

    await this._settings.GrantPermissionsToApplication({
      applicationId: applicationId,
      permission: this.requestedPermission,
    });
    await this._settings.RefreshSettings();
    return new CommandReturn<boolean>(true, EventName.PermissionGranted);
  }
}

export default AskPermissionCommand;
