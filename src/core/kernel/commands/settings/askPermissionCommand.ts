// import Settings from "@core/settings/settings";
// import javascriptOs from "@inversify/inversify.config";
// import { EventName } from "@ostypes/ProcessTypes";
// import {  ICommand } from "@ostypes/CommandTypes";
// import types from "@ostypes/types";
// import { Permissions } from "@thijmen-os/common";
// import { GrantPermission } from "@thijmen-os/prompt";
// import { Process } from "@core/processManager/interfaces/baseProcess";
// import Exit from "@providers/error/systemErrors/Exit";

// class AskPermissionCommand implements ICommand {
//   private readonly _settings = javascriptOs.get<Settings>(types.Settings);

//   private readonly _requestedPermission: Permissions;

//   constructor(props: Permissions) {
//     this._requestedPermission = props;
//   }

//   public async Handle(Process: Process): Promise<Exit> {
//     const application =
//       this._settings.Settings.applications.installedApplications.find(
//         (app) =>
//           app.applicationIdentifier === Process.processIdentifier.toString()
//       );

//     if (!application) return new Exit(false);

//     const permissionAlreadyGranted = application.permissions.some(
//       (permission) => permission === this._requestedPermission
//     );

//     if (permissionAlreadyGranted)
//       return new Exit(true, EventName.PermissionGranted);

//     const userInteraction = new Promise((resolve) => {
//       new GrantPermission(
//         this._requestedPermission,
//         Process.processIdentifier,
//         application!.name,
//         (res: boolean): void => {
//           resolve(res);
//         }
//       );
//     });

//     const granted = await userInteraction;
//     if (!granted) {
//       return new Exit<boolean>(false, EventName.PermissionNotGranted);
//     }

//     await this._settings.ApplicationSettings.GrantPermissionsToApplication({
//       applicationId: Process.processIdentifier,
//       permission: this._requestedPermission,
//     });
//     await this._settings.RefreshSettings();
//     return new Exit<boolean>(true, EventName.PermissionGranted);
//   }
// }

// export default AskPermissionCommand;
