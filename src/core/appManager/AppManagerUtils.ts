/* <Class Documentation>

  <Class Description>
    AppManagerUtls is a set of utility methods that are used by AppManager.ts

  <Method Description>
    FindInstalledAppsWithMimetype(): This method finds applications that support a given mimetype.
    FindTargetApp(): When the AppManager needs to do some operations on an application it gets the application hash. With this has the FindTargetApp method will try to find the mathing application meta data

*/

//DI
import { injectable } from "inversify";
import javascriptOs from "../../../inversify.config";
import types from "@ostypes/types";

//Classes
import { Window } from "@thijmenos/window";

//DI interfaces
import IErrorManager from "@core/errorManager/IErrorManager";

//Types
import { ApplicationMetaData, MimeTypes } from "@thijmenos/common";

@injectable()
class AppManagerUtils {
  protected readonly _errorManager: IErrorManager;

  protected openApps: Array<Window> = new Array<Window>();
  protected installedApps: Array<ApplicationMetaData> =
    new Array<ApplicationMetaData>();

  constructor() {
    this._errorManager = javascriptOs.get<IErrorManager>(types.ErrorManager);
  }

  protected FindInstalledAppsWithMimetype = (
    mimeType: MimeTypes
  ): Array<ApplicationMetaData> =>
    this.installedApps.filter((app) => app.mimeTypes.includes(mimeType));

  protected FindTargetApp = (target: string): Window => {
    const targetApp = this.openApps.find(
      (app) => app.windowOptions.windowIdentifier === target
    );

    if (!targetApp) {
      throw new Error("the app could not be found!");
    }

    return targetApp;
  };
}

export default AppManagerUtils;
