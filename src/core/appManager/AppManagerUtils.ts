import { ApplicationMetaData } from "@ostypes/ApplicationTypes";
import { MimeTypes } from "@ostypes/SettingsTypes";
import Window from "@drivers/graphic/window/Window";
import { injectable } from "inversify";
import types from "@ostypes/types";
import IErrorManager from "@core/errorManager/IErrorManager";
import javascriptOs from "../../../inversify.config";

@injectable()
class AppManagerUtils {
  private _errorManager: IErrorManager;

  protected openApps: Array<Window> = new Array<Window>();
  protected installedApps: Array<ApplicationMetaData> =
    new Array<ApplicationMetaData>();

  constructor() {
    this._errorManager = javascriptOs.get<IErrorManager>(types.ErrorManager);
  }

  protected findAppsWithDesiredMimetype = (
    mimeType: MimeTypes
  ): Array<ApplicationMetaData> =>
    this.installedApps.filter((app) => app.mimeTypes.includes(mimeType));

  protected findTargetApp = (target: string): Window => {
    const targetApp = this.openApps.find(
      (app) => app.windowOptions.windowIdentifier === target
    );

    if (targetApp === undefined) {
      this._errorManager.RaiseError("");
      throw new Error("the app could not be found!");
    }

    return targetApp;
  };
}

export default AppManagerUtils;
