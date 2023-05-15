// import Settings from "@core/settings/settings";
// import javascriptOs from "@inversify/inversify.config";
// import { EventName } from "@ostypes/ProcessTypes";
// import {  ICommand } from "@ostypes/CommandTypes";
// import types from "@ostypes/types";

// //TODO: Implement root. this method can only be access by root actors
// class RevokeAllPermissionCommand implements ICommand {
//   private readonly _settings = javascriptOs.get<Settings>(types.Settings);

//   private readonly _applicationId: string;

//   constructor(applicationId: string) {
//     this._applicationId = applicationId;
//   }

//   public async Handle(): Promise<CommandReturn<boolean>> {
//     const application =
//       this._settings.Settings.applications.installedApplications.find(
//         (app) => app.applicationIdentifier === this._applicationId.toString()
//       );

//     if (!application) return new Exit(false, EventName.Error);

//     await this._settings.ApplicationSettings.RevokeAllApplicationPermissions(
//       this._applicationId
//     );
//     await this._settings.RefreshSettings();
//     return new Exit<boolean>(true, EventName.PermissionRevoked);
//   }
// }

// export default RevokeAllPermissionCommand;
