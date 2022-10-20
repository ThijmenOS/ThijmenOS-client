import { inject, injectable } from "inversify";
import javascriptOs from "../../inversify.config";
import types from "@interface/types";

import FileIcon from "fileIcon/fileIcon";
import Window from "window/window";

import { IAppManager } from "@interface/appManager";
import { ICreateWindow } from "@interface/window/createWindow";
import { IFileSystem } from "@interface/fileSystem/fileSystem";
import { IPrompt } from "@interface/prompt/prompt";
import { IUtils } from "@interface/utils/utils";

import { ApplicationMetaData } from "@interface/application/applicationProperties";

@injectable()
class AppManager implements IAppManager {
  private readonly _utils: IUtils;
  private readonly _fileSystem: IFileSystem;
  private readonly _prompt: IPrompt;

  private openApps: Array<Window> = new Array<Window>();
  private installedApps: Array<ApplicationMetaData> =
    new Array<ApplicationMetaData>();

  constructor(
    @inject(types.Utils) utils: IUtils,
    @inject(types.FileSystem) fileSystem: IFileSystem,
    @inject(types.Prompt) prompt: IPrompt
  ) {
    this._utils = utils;
    this._fileSystem = fileSystem;
    this._prompt = prompt;
  }

  public async FetchInstalledApps(): Promise<void> {
    this.installedApps = await this._fileSystem.FetchInstalledApplications();
  }

  public openApplicationWithMimeType(requestingApp: string, mimeType: string) {
    const targetApp = this.openApps.find(
      (app) => app.windowOptions.windowTitle === requestingApp
    );

    targetApp?.Freese();

    const installedAppsWithDesiredMimetype: Array<ApplicationMetaData> =
      this.installedApps.filter((app) => app.mimeTypes.includes(mimeType));

    const resultTitles = installedAppsWithDesiredMimetype.map((a) => a.title);

    this._prompt.Prompt().SelectApp(resultTitles, (selectedApp: string) => {
      this.OpenApplication(
        installedAppsWithDesiredMimetype.find(
          (app) => app.title === selectedApp
        )!
      );
      targetApp?.Unfreese();
    });
  }

  public OpenApplication(
    applicationDetails: FileIcon | ApplicationMetaData
  ): void {
    const application = javascriptOs
      .get<ICreateWindow>(types.CreateWindow)
      .Application(applicationDetails);

    this.openApps.push(application);
  }

  public CheckIfAppExists(appName: string): boolean {
    return this.openApps.some(
      (win) => win.windowOptions.windowTitle === appName
    );
  }

  public CloseApplication(targetWindow: string): void {
    const targetWin = this.openApps.find(
      (window: Window): boolean =>
        window.windowOptions.windowTitle === targetWindow
    );

    if (targetWin) targetWin.Destroy();
  }
  public async SendDataToApp<T>(
    app: string,
    data: T,
    sender: string
  ): Promise<void> {
    if (!sender || !app) throw new Error("No app or sender specified!");

    const content = {
      sender: sender,
      return: data,
    };

    this._utils
      .WaitForElm<HTMLIFrameElement>(app)
      .then((res: HTMLIFrameElement) => {
        setTimeout(() => {
          res.contentWindow?.postMessage(content, "*");
        }, 200);
      });
  }
}

export default AppManager;
