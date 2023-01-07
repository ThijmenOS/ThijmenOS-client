//geeft instantie van de class mee

import Settings from "@core/settings/settingsMethodShape";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { EventName } from "@ostypes/AppManagerTypes";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import { Permissions } from "@thijmen-os/common";
import { injectable } from "inversify";

@injectable()
class Mediator {
  private readonly _settings = javascriptOs.get<Settings>(types.Settings);

  public send(command: ICommand, requestingApplicationId: string) {
    if (command.requiredPermission === undefined) {
      return command.Handle();
    }

    const applicationCanExecuteCommand = this.validatePermission(
      command.requiredPermission,
      requestingApplicationId
    );

    if (!applicationCanExecuteCommand) {
      return new CommandReturn<string>(
        `No permission to execute ${command.requiredPermission}`,
        EventName.Error
      );
    }

    return command.Handle();
  }

  private validatePermission(
    permissionToValidate: Permissions,
    applicationId: string
  ): boolean | undefined {
    const targetApplication = this._settings.settings.apps.installedApps.find(
      (app) => app.applicationIdentifier === applicationId
    );

    console.log(targetApplication);

    const hasValidPermissions = targetApplication?.permissions.some(
      (permission) => permission === permissionToValidate
    );

    return hasValidPermissions;
  }
}

export default Mediator;
