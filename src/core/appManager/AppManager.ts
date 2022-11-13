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

//DI interfaces
import AppManagerUtils from "./AppManagerUtils";
import IAppManager from "./IAppManager";
import { WaitForElm } from "@thijmenos/graphics";

//Types
import { ApplicationMetaData } from "@thijmenos/common";
import { OpenFileType } from "@ostypes/KernelTypes";
import ISettings from "@core/settings/ISettings";
import { Event, EventName, system } from "@ostypes/AppManagerTypes";
import Prompt from "@drivers/graphic/prompt/Prompt";
import { Window, CreateWindow } from "@thijmenos/window";

@injectable()
class AppManager extends AppManagerUtils implements IAppManager {
  private readonly _settings: ISettings;

  constructor(@inject(types.Settings) settings: ISettings) {
    super();

    this._settings = settings;
  }

  public async FetchInstalledApps(): Promise<void> {
    this.installedApps = this._settings.settings.apps.installedApps;
  }

  public OpenFileWithApplication(file: OpenFileType) {
    const installedAppsWithDesiredMimetype = this.FindInstalledAppsWithMimetype(
      file.mimeType
    );

    const resultTitles = installedAppsWithDesiredMimetype.map((a) => a.title);

    let prompt = javascriptOs.get<Prompt>(types.Prompt);

    if (!resultTitles.length) {
      this._errorManager.RaiseError().FileTypeNotSupportedError();
      return;
    }

    prompt = prompt.Prompt();

    prompt.SelectApp(resultTitles, (selectedApp: string) => {
      const app = installedAppsWithDesiredMimetype.find(
        (app) => app.title === selectedApp
      )!;
      const openedApp = this.OpenExecutable(app);
      this.SendDataToApp<string>(
        openedApp.windowOptions.windowIdentifier,
        file.filePath,
        "system",
        EventName.OpenFile
      );
    });
  }

  public OpenFile(file: OpenFileType): void {
    const DefaultAppToOpen = this._settings.DefaultApplication(file.mimeType);

    if (!DefaultAppToOpen) {
      this.OpenFileWithApplication(file);
      return;
    }

    const application = this.OpenExecutable(DefaultAppToOpen);

    this.SendDataToApp(
      application.windowOptions.windowIdentifier,
      file.filePath,
      system,
      EventName.OpenFile
    );
  }

  public OpenExecutable(
    applicationDetails: FileIcon | ApplicationMetaData
  ): Window {
    const application = new CreateWindow().Application(applicationDetails);

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
    //TODO: In development I can throw. But in the end log the incident with as much information as possible
    //TODO: Create logger
    if (!sender || !app) throw new Error("No app or sender specified!");

    const event: Event<T> = {
      eventName: eventName,
      eventSender: sender,
      eventData: data,
    };

    WaitForElm<HTMLIFrameElement>(app).then((res: HTMLIFrameElement) => {
      setTimeout(() => {
        res.contentWindow?.postMessage(event, "*");
      }, 200);
    });
  }
}

export default AppManager;
