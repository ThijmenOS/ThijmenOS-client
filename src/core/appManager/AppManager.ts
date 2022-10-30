/* <Class Documentation>

  <Class Description>
    The app manager manages everything that has something to do with an application. 

  When the kernel for instance wants to open an application, it will call the appmanager to do so

  <Method Description>
  FetchInstalledApps(): This method will get the list of installed applications from the backend.
    |_ Installed applications are used to determine which applications are known to the operating system. This then is used to check which apps are available to open a certain mimetype or to provide permissions to for example.

  OpenFileWithApplication(): This method will will ask the user with which registerd application a file with a cetrain mime type has to be opened.
  OpenFile(): This method will open a file with the default application that is registered for that mimetype

  OpenExecutable(): This method will create a new window on the screen with the provided application configuration
  CloseExecutable(): This method will find a currently open application and close it

  CheckIfAppIsOpen(): This method will check if an application is currently open
  SendDataToApp(): This method will send an event to an application.
    |_ Applications are rendered within an Iframe to be more secure. This is to prevent the application from interactig with operating system code or style. But because this is an Iframe data can't just flow normally from the application to the os. Thats why it uses this special method. It send an message to the Iframe. application then can implement listener functions for various events. The OS privedes an structured api to do this. (more information can be found in OperatingSystemApi.js)

*/

//DI
import { inject, injectable } from "inversify";
import javascriptOs from "../../../inversify.config";
import types from "@ostypes/types";

//Classes
import FileIcon from "@drivers/graphic/fileIcon/FileIcon";
import Window from "@drivers/graphic/window/Window";

//DI interfaces
import AppManagerUtils from "./AppManagerUtils";
import IAppManager from "./IAppManager";
import ICreateWindow from "@drivers/graphic/window/IWindowCreation";
import IPrompt from "@drivers/graphic/prompt/IPrompt";

//Types
import { ApplicationMetaData } from "@ostypes/ApplicationTypes";
import IGraphicsUtils from "@drivers/graphic/utils/IGraphicUtils";
import { OpenFile } from "@ostypes/KernelTypes";
import { Path } from "@common/FileSystem";
import ISettings from "@core/settings/ISettings";
import { MimeTypes } from "@ostypes/SettingsTypes";
import { Event, EventName, system } from "@ostypes/AppManagerTypes";

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

  public OpenFileWithApplication(requestingApp: string, props: OpenFile) {
    const targetApp = this.FindTargetApp(requestingApp);

    targetApp.Freese();

    const installedAppsWithDesiredMimetype = this.FindInstalledAppsWithMimetype(
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

  public OpenExecutable(
    applicationDetails: FileIcon | ApplicationMetaData
  ): Window {
    const application = javascriptOs
      .get<ICreateWindow>(types.CreateWindow)
      .Application(applicationDetails);

    this.openApps.push(application);

    return application;
  }

  public CheckIfAppIsOpen(origin: string): boolean {
    return this.openApps.some(
      (win) => win.windowOptions.windowIdentifier === origin
    );
  }

  public CloseExecutable(targetWindow: string): void {
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
