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
import types from "@ostypes/types";

//Classes

//DI interfaces
import ApplicationManagerPrivateMethods from "./applicationManagerPrivateMethods";
import ApplicationManagerMethodShape from "./applicationManagerMethodShape";
import { WaitForElm } from "@thijmen-os/graphics";

//Types
import { Directory, IconMetadata } from "@thijmen-os/common";
import { OpenFileType } from "@core/kernel/kernelTypes";
import ISettings from "@core/settings/settingsMethodShape";
import {
  ApplicationInstance,
  Event,
  EventName,
  system,
} from "@ostypes/AppManagerTypes";
import { SelectApplication } from "@thijmen-os/prompt";
import ErrorManager from "@thijmen-os/errormanager";
import ICache from "@core/memory/memoryMethodShape";
import ApplicationWindow from "@core/applicationWindow/applicationWindow";
import CreateApplicationWindow from "@core/applicationWindow/interfaces/createApplicationWindowMethodShape";
import { ShowFilesInDir } from "@providers/filesystemEndpoints/filesystem";
import GenerateUUID from "@utils/generateUUID";

@injectable()
class ApplicationManager
  extends ApplicationManagerPrivateMethods
  implements ApplicationManagerMethodShape
{
  private readonly _settings: ISettings;
  private readonly _cache: ICache;
  private readonly _window: CreateApplicationWindow;

  private readonly desktopPath = "C/Desktop";

  constructor(
    @inject(types.Settings) settings: ISettings,
    @inject(types.Cache) cache: ICache,
    @inject(types.CreateWindow) createWindow: CreateApplicationWindow
  ) {
    super();

    this._settings = settings;
    this._cache = cache;
    this._window = createWindow;
  }

  public async FetchInstalledApps(): Promise<void> {
    this.installedApps = this._settings.settings.apps.installedApps;
  }

  public async ShowFilesOnDesktop() {
    const desktopFiles = await ShowFilesInDir(this.desktopPath);

    this._cache.saveToMemory<Array<Directory>>("desktopFiles", desktopFiles);

    this.RenderIcon(desktopFiles);
  }

  public FindCorrespondingAppWithWindowHash(target: string): string {
    const targetApp = this.openApps.find((app) =>
      app.applicationWindows.find(
        (window) => window.windowOptions.windowIdentifier === target
      )
    );

    if (!targetApp) {
      throw new Error("the app could not be found!");
    }

    return targetApp.applicationId;
  }

  public async RefreshDesktopApps() {
    const cacheFiles =
      this._cache.loadFromMemory<Array<Directory>>("desktopFiles");
    const allFiles = await ShowFilesInDir(this.desktopPath);

    const newFiles = allFiles.filter(
      (x) => !cacheFiles.find((y) => x.filePath === y.filePath)
    );

    this.RenderIcon(newFiles);
  }

  public OpenFileWithApplication(file: OpenFileType): void {
    const installedAppsWithDesiredMimetype = this.FindInstalledAppsWithMimetype(
      file.mimeType
    );

    const resultTitles = installedAppsWithDesiredMimetype.map((a) => a.name);

    if (!resultTitles.length) {
      ErrorManager.noApplicationForFiletypeError();
      return;
    }

    new SelectApplication(resultTitles, (selectedApp: string) => {
      const app = installedAppsWithDesiredMimetype.find(
        (app) => app.name === selectedApp
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

  public OpenExecutable(iconMetadata: IconMetadata): ApplicationWindow {
    const targetedApplication = this._settings.settings.apps.installedApps.find(
      (x) => x.exeLocation === iconMetadata.exeLocation
    );

    if (!targetedApplication) {
      ErrorManager.applicationNotFoundError();
      throw new Error();
    }
    const applicationWindow = this._window.Application(iconMetadata);

    const applicationInstance = this.openApps.find(
      (instance) =>
        instance.applicationId === targetedApplication.applicationIdentifier
    );
    if (applicationInstance) {
      applicationInstance.applicationWindows.push(applicationWindow);
    } else {
      const instance: ApplicationInstance = {
        instanceId: GenerateUUID(),
        applicationId: targetedApplication.applicationIdentifier,
        applicationWindows: [applicationWindow],
      };

      this.openApps.push(instance);
    }

    console.log(this.openApps);

    return applicationWindow;
  }

  public CheckIfAppIsOpen(windowHash: string): boolean {
    return this.openApps.some((app) =>
      app.applicationWindows.some(
        (window) => window.windowOptions.windowIdentifier === windowHash
      )
    );
  }

  public CloseExecutable(targetWindowHash: string): void {
    const targetApplicationInstanceIndex = this.openApps.findIndex((instance) =>
      instance.applicationWindows.some(
        (window) => window.windowOptions.windowIdentifier === targetWindowHash
      )
    );
    const targetWindowIndex = this.openApps[
      targetApplicationInstanceIndex
    ].applicationWindows.findIndex(
      (window) => window.windowOptions.windowIdentifier === targetWindowHash
    );

    if (targetWindowIndex !== -1)
      this.openApps[targetApplicationInstanceIndex].applicationWindows[
        targetWindowIndex
      ].Destroy();

    this.openApps[targetApplicationInstanceIndex].applicationWindows.splice(
      targetWindowIndex,
      1
    );

    if (
      !this.openApps[targetApplicationInstanceIndex].applicationWindows.length
    ) {
      this.openApps.splice(targetApplicationInstanceIndex, 1);
    }

    console.log(this.openApps);
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

export default ApplicationManager;
