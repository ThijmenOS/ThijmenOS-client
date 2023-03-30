//geeft instantie van de class mee

import { ICommand } from "@ostypes/CommandTypes";
import { injectable } from "inversify";

@injectable()
class Mediator {
  public async send(command: ICommand, requestingApplicationId: string) {
    return command.Handle(requestingApplicationId);

    // if (command.requiredPermission === undefined) {
    //   return command.Handle(requestingApplicationId);
    // }

    // const applicationCanExecuteCommand = await this.validatePermission(
    //   command.requiredPermission,
    //   requestingApplicationId
    // );

    // if (!applicationCanExecuteCommand)
    //   return new CommandReturn<string>(
    //     `No permission to execute ${command.requiredPermission}`,
    //     EventName.Error
    //   );

    // return command.Handle(requestingApplicationId);
  }

  // private async validatePermission(
  //   permissionToValidate: Permissions,
  //   applicationId: string
  // ): Promise<boolean> {
  //   const targetApplication =
  //     this._settings.settings.applications.installedApplications.find(
  //       (app) => app.applicationIdentifier === applicationId
  //     );

  //   if (!targetApplication) return false;

  //   let hasValidPermissions = targetApplication.permissions.some(
  //     (permission) => permission === permissionToValidate
  //   );

  //   if (!hasValidPermissions) {
  //     const Timeout = new Promise<boolean>((response) => {
  //       setTimeout(() => {
  //         const validPermissions = targetApplication.permissions.some(
  //           (permission) => permission === permissionToValidate
  //         );
  //         response(validPermissions);
  //       }, 1000);
  //     });
  //     hasValidPermissions = await Timeout;
  //   }

  //   return hasValidPermissions;
  // }
}

export default Mediator;
