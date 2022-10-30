import { inject, injectable } from "inversify";
import javascriptOs from "../../../inversify.config";
import types from "@ostypes/types";

import FileIcon from "@drivers/graphic/fileIcon/FileIcon";
import Window from "@drivers/graphic/window/Window";

import IAppManager from "./IAppManager";
import ICreateWindow from "@drivers/graphic/window/IWindowCreation";
import IPrompt from "@drivers/graphic/prompt/IPrompt";

import { ApplicationMetaData } from "@ostypes/ApplicationTypes";
import IGraphicsUtils from "@drivers/graphic/utils/IGraphicUtils";
import { OpenFile } from "@ostypes/KernelTypes";
import { Path } from "@common/FileSystem";
import ISettings from "@core/settings/ISettings";
import { MimeTypes } from "@ostypes/SettingsTypes";
import { Event, EventName, system } from "@ostypes/AppManagerTypes";
import AppManagerUtils from "./AppManagerUtils";

@injectable()
class AppManager extends AppManagerUtils implements IAppManager {
  private readonly _graphicsUtils: IGraphicsUtils;
  private readonly _settings: ISettings;

  constructor(
    @inject(types.GraphicsUtils) graphicsUtils: IGraphicsUtils,
    @inject(types.Settings) settings: ISettings
  ) {
    super();

    this._graphicsUtils = graphicsUtils;
    this._settings = settings;
  }

  public async FetchInstalledApps(): Promise<void> {
    await this._settings.Initialise();
    this.installedApps = this._settings.settings.apps.installedApps;
  }

  public openApplicationWithMimeType(requestingApp: string, props: OpenFile) {
    const targetApp = this.findTargetApp(requestingApp);

    targetApp.Freese();

    const installedAppsWithDesiredMimetype = this.findAppsWithDesiredMimetype(
      props.mimeType
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
        const openedApp = this.OpenExecutable(app);
        this.SendDataToApp<string>(
          openedApp.windowOptions.windowIdentifier,
          props.filePath,
          requestingApp,
          EventName.OpenFile
        );
        targetApp.Unfreese();
      });
  }

  public OpenExecutable(
    applicationDetails: FileIcon | ApplicationMetaData
  ): Window {
    const application = javascriptOs
      .get<ICreateWindow>(types.CreateWindow)
      .Application(applicationDetails);

    this.openApps.push(application);

    return application;
  }

  public OpenFile(mimeType: MimeTypes, filePath: Path): Window {
    const AppToOpen = this._settings.DefaultApplication(mimeType);

    if (!AppToOpen) throw new Error("File type not supported!");

    const application = this.OpenExecutable(AppToOpen);

    this.SendDataToApp(
      application.windowOptions.windowIdentifier,
      filePath,
      system,
      EventName.OpenFile
    );

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
    sender: string,
    eventName: EventName
  ): Promise<void> {
    if (!sender || !app) throw new Error("No app or sender specified!");

    const event: Event<T> = {
      eventName: eventName,
      eventSender: sender,
      eventData: data,
    };

    this._graphicsUtils
      .WaitForElm<HTMLIFrameElement>(app)
      .then((res: HTMLIFrameElement) => {
        setTimeout(() => {
          res.contentWindow?.postMessage(event, "*");
        }, 200);
      });
  }
}

export default AppManager;
