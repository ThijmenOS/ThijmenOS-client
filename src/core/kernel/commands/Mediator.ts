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

  public async send(command: ICommand, requestingApplicationId: string) {
    if (command.requiredPermission === undefined) {
      return command.Handle(requestingApplicationId);
    }

    const applicationCanExecuteCommand = await this.validatePermission(
      command.requiredPermission,
      requestingApplicationId
    );

    if (!applicationCanExecuteCommand)
      return new CommandReturn<string>(
        `No permission to execute ${command.requiredPermission}`,
        EventName.Error
      );

    return command.Handle(requestingApplicationId);
  }

  private async validatePermission(
    permissionToValidate: Permissions,
    applicationId: string
  ): Promise<boolean> {
    const targetApplication = this._settings.settings.apps.installedApps.find(
      (app) => app.applicationIdentifier === applicationId
    );

    if (!targetApplication) return false;

    let hasValidPermissions = targetApplication.permissions.some(
      (permission) => permission === permissionToValidate
    );

    if (!hasValidPermissions) {
      const Timeout = new Promise<boolean>((response) => {
        setTimeout(() => {
          const validPermissions = targetApplication.permissions.some(
            (permission) => permission === permissionToValidate
          );
          response(validPermissions);
        }, 1000);
      });
      hasValidPermissions = await Timeout;
    }

    return hasValidPermissions;
  }
}

export default Mediator;
