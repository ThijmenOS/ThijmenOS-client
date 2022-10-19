import FileIcon from "@app/file-icon/fileIcon";
import AppWindow from "@app/window/appWindow";
import { Props } from "@interface/application/applicationProperties";
import { IAppManager } from "@interface/appManager";
import { ICreateWindow } from "@interface/appWindow/createWindow";
import { IFileSystem } from "@interface/fileSystem/fileSystem";
import types from "@interface/types";
import { IUtils } from "@interface/utils/utils";
import { appIcon } from "@static/dom-defaults";
import { inject, injectable } from "inversify";

@injectable()
class AppManager implements IAppManager {
  private readonly _createWindow: ICreateWindow;
  private readonly _utils: IUtils;
  private readonly _fileSystem: IFileSystem;

  private openApps: Array<AppWindow> = new Array<AppWindow>();
  private installedApps: Array<Props> = new Array<Props>();

  constructor(
    @inject(types.CreateWindow) createWindow: ICreateWindow,
    @inject(types.Utils) utils: IUtils,
    @inject(types.FileSystem) fileSystem: IFileSystem
  ) {
    this._createWindow = createWindow;
    this._utils = utils;
    this._fileSystem = fileSystem;
  }

  public async FetchInstalledApps(): Promise<void> {
    this.installedApps = await this._fileSystem.FetchInstalledApplications();
  }

  public openApplicationWithMimeType(mimeType: string) {
    console.log(this.installedApps);
    console.log(mimeType);
    let installedAppsWithDesiredMimetype = this.installedApps.find((app) =>
      app.mimeTypes.includes(mimeType)
    );
    console.log(installedAppsWithDesiredMimetype);
  }

  public OpenApplication(applicationDetails: FileIcon): void {
    let application = this._createWindow.Application(applicationDetails);

    this.openApps.push(application);
  }

  public CheckIfAppExists(appName: string): boolean {
    return this.openApps.some(
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
