import { inject, injectable } from "inversify";
import javascriptOs from "../../../inversify.config";
import types from "@ostypes/types";

import FileIcon from "@drivers/graphic/fileIcon/FileIcon";
import Window from "@drivers/graphic/window/Window";

import IAppManager from "./IAppManager";
import ICreateWindow from "@drivers/graphic/window/IWindowCreation";
import IFileSystem from "@drivers/fileSystem/IFileSystem";
import IPrompt from "@drivers/graphic/prompt/IPrompt";

import { ApplicationMetaData } from "@ostypes/ApplicationTypes";
import IGraphicsUtils from "@drivers/graphic/utils/IGraphicUtils";

@injectable()
class AppManager implements IAppManager {
  private readonly _graphicsUtils: IGraphicsUtils;
  private readonly _fileSystem: IFileSystem;
  private readonly _prompt: IPrompt;

  private openApps: Array<Window> = new Array<Window>();
  private installedApps: Array<ApplicationMetaData> =
    new Array<ApplicationMetaData>();

  constructor(
    @inject(types.GraphicsUtils) graphicsUtils: IGraphicsUtils,
    @inject(types.FileSystem) fileSystem: IFileSystem,
    @inject(types.Prompt) prompt: IPrompt
  ) {
    this._graphicsUtils = graphicsUtils;
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

    this._graphicsUtils
      .WaitForElm<HTMLIFrameElement>(app)
      .then((res: HTMLIFrameElement) => {
        setTimeout(() => {
          res.contentWindow?.postMessage(content, "*");
        }, 200);
      });
  }
}

export default AppManager;
