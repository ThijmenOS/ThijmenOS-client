//geeft instantie van de class mee

import { BaseProcess } from "@core/processManager/processes/baseProcess";
import { ICommand } from "@ostypes/CommandTypes";
import { injectable } from "inversify";

@injectable()
class Mediator {
  public async Send(command: ICommand, Process: BaseProcess) {
    return command.Handle(Process);

    // if (command.requiredPermission === undefined) {
    //   return command.Handle(requestingApplicationId);
    // }

    // const applicationCanExecuteCommand = await this.validatePermission(
    //   command.requiredPermission,
    //   requestingApplicationId
    // );

    // if (!applicationCanExecuteCommand)
    //   return new Exit<string>(
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
