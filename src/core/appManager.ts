import FileIcon from "@app/file-icon/fileIcon";
import AppWindow from "@app/window/appWindow";
import { IAppManager } from "@interface/appManager";
import { ICreateWindow } from "@interface/appWindow/createWindow";
import types from "@interface/types";
import { IUtils } from "@interface/utils/utils";
import { inject, injectable } from "inversify";

@injectable()
class AppManager implements IAppManager {
  private readonly _createWindow: ICreateWindow;
  private readonly _utils: IUtils;

  private openApps: Array<AppWindow> = new Array<AppWindow>();

  constructor(
    @inject(types.CreateWindow) createWindow: ICreateWindow,
    @inject(types.Utils) utils: IUtils
  ) {
    this._createWindow = createWindow;
    this._utils = utils;
  }

  public openApplication(applicationDetails: FileIcon): void {
    let application = this._createWindow.Application(applicationDetails);

    this.openApps.push(application);
  }

  public CheckIfAppExists(appName: string): boolean {
    return !this.openApps.find(
      (win) => win.windowOptions.windowTitle === appName
    );
  }

  public CloseApplication(targetWindow: string): void {
    let targetWin = this.openApps.find(
      (window: AppWindow): boolean =>
        window.windowOptions.windowTitle == targetWindow
    );

    if (targetWin) targetWin.Destroy();
  }
  public async SendDataToApp(
    app: string,
    data: string | object,
    sender: string
  ): Promise<void> {
    if (!sender || !app) throw new Error("No app or sender specified!");
    let content = {
      sender: sender,
      return: data,
    };

    this._utils.WaitForElm(app).then((res: any) => {
      setTimeout(() => {
        res.contentWindow.postMessage(content, "*");
      }, 200);
    });
  }
}

export default AppManager;
