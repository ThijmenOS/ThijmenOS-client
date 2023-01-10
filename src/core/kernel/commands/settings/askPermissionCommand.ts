import Settings from "@core/settings/settings";
import javascriptOs from "@inversify/inversify.config";
import { EventName } from "@ostypes/AppManagerTypes";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import { PermissionRequestDto } from "@thijmen-os/common";
import { GrantPermission } from "@thijmen-os/prompt";

class AskPermissionCommand implements ICommand {
  private readonly _settings = javascriptOs.get<Settings>(types.Settings);

  private readonly props: PermissionRequestDto;

  constructor(props: PermissionRequestDto) {
    this.props = props;
  }

  public async Handle(): Promise<CommandReturn<boolean>> {
    const application = this._settings.settings.apps.installedApps.find(
      (app) => app.applicationIdentifier === this.props.applicationId.toString()
    );

    if (!application) return new CommandReturn(false, EventName.Error);

    const permissionAlreadyGranted = application.permissions.some(
      (permission) => permission === this.props.permission
    );

    if (permissionAlreadyGranted)
      return new CommandReturn(true, EventName.PermissionGranted);

    const userInteraction = new Promise((resolve) => {
      new GrantPermission(
        this.props.permission,
        this.props.applicationId,
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

    await this._settings.GrantPermissionsToApplication(this.props);
    await this._settings.RefreshSettings();
    return new CommandReturn<boolean>(true, EventName.PermissionGranted);
  }
}

export default AskPermissionCommand;
