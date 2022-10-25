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
import { OpenFile } from "@ostypes/KernelTypes";

@injectable()
class AppManager implements IAppManager {
  private readonly _graphicsUtils: IGraphicsUtils;
  private readonly _fileSystem: IFileSystem;

  private openApps: Array<Window> = new Array<Window>();
  private installedApps: Array<ApplicationMetaData> =
    new Array<ApplicationMetaData>();

  constructor(
    @inject(types.GraphicsUtils) graphicsUtils: IGraphicsUtils,
    @inject(types.FileSystem) fileSystem: IFileSystem
  ) {
    this._graphicsUtils = graphicsUtils;
    this._fileSystem = fileSystem;
  }

  public async FetchInstalledApps(): Promise<void> {
    this.installedApps = await this._fileSystem.FetchInstalledApplications();
  }

  public openApplicationWithMimeType(requestingApp: string, props: OpenFile) {
    const targetApp = this.openApps.find(
      (app) => app.windowOptions.windowIdentifier === requestingApp
    );

    targetApp?.Freese();

    const installedAppsWithDesiredMimetype: Array<ApplicationMetaData> =
      this.installedApps.filter((app) =>
        app.mimeTypes.includes(props.mimeType)
      );

    const resultTitles = installedAppsWithDesiredMimetype.map((a) => a.title);

    javascriptOs
      .get<IPrompt>(types.Prompt)
      .Prompt({
        left: window.getComputedStyle(targetApp!.windowContainerElement).left,
        top: window.getComputedStyle(targetApp!.windowContainerElement).top,
      })
      .SelectApp(resultTitles, (selectedApp: string) => {
        const app = installedAppsWithDesiredMimetype.find(
          (app) => app.title === selectedApp
        )!;
        const openedApp = this.OpenApplication(app);
        this.SendDataToApp<string>(
          openedApp.windowOptions.windowIdentifier,
          props.filePath,
          requestingApp
        );
        targetApp?.Unfreese();
      });
  }

  public OpenApplication(
    applicationDetails: FileIcon | ApplicationMetaData
  ): Window {
    const application = javascriptOs
      .get<ICreateWindow>(types.CreateWindow)
      .Application(applicationDetails);

    this.openApps.push(application);

    return application;
  }

  public CheckIfAppExists(origin: string): boolean {
    return this.openApps.some(
      (win) => win.windowOptions.windowIdentifier === origin
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
