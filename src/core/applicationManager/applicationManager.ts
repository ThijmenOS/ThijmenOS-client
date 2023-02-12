//DI
import { inject, injectable } from "inversify";
import types from "@ostypes/types";

//Classes

//DI interfaces
import ApplicationManagerMethodShape from "./applicationManagerMethodShape";
import { WaitForElm } from "@thijmen-os/graphics";

//Types
import { ApplicationMetaData, MimeTypes } from "@thijmen-os/common";
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
import ApplicationWindow from "@core/applicationWindow/applicationWindow";
import CreateApplicationWindow from "@core/applicationWindow/interfaces/createApplicationWindowMethodShape";
import GenerateUUID from "@utils/generateUUID";

@injectable()
class ApplicationManager implements ApplicationManagerMethodShape {
  private readonly _settings: ISettings;
  private readonly _window: CreateApplicationWindow;

  public openApps: Array<ApplicationInstance> =
    new Array<ApplicationInstance>();
  public installedApps: Array<ApplicationMetaData> =
    new Array<ApplicationMetaData>();

  constructor(
    @inject(types.Settings) settings: ISettings,
    @inject(types.CreateWindow) createWindow: CreateApplicationWindow
  ) {
    this._settings = settings;
    this._window = createWindow;
  }

  public async FetchInstalledApps(): Promise<void> {
    this.installedApps = this._settings.settings.apps.installedApps;
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

  public OpenFileWithApplication(file: OpenFileType): void {
    const installedAppsWithDesiredMimetype = this.FindInstalledAppsWithMimetype(
      file.mimeType
    );

    console.log(file);

    const resultTitles = installedAppsWithDesiredMimetype.map((a) => a.name);

    if (!resultTitles.length) {
      ErrorManager.noApplicationForFiletypeError();
      return;
    }

    new SelectApplication(resultTitles, async (selectedApp: string) => {
      const app = installedAppsWithDesiredMimetype.find(
        (app) => app.name === selectedApp
      )!;
      const openedApp = await this.OpenExecutable(app, false);
      this.SendDataToApp<string>(
        openedApp.windowOptions.windowIdentifier,
        file.filePath,
        "system",
        EventName.OpenFile
      );
    });
  }

  public async OpenFile(file: OpenFileType): Promise<boolean> {
    const DefaultAppToOpen = this._settings.DefaultApplication(file.mimeType);

    console.log(file);

    if (!DefaultAppToOpen) {
      this.OpenFileWithApplication(file);
      return false;
    }

    const application = await this.OpenExecutable(DefaultAppToOpen, false);

    this.SendDataToApp(
      application.windowOptions.windowIdentifier,
      file.filePath,
      system,
      EventName.OpenFile
    );

    return true;
  }

  public async OpenExecutable(
    iconMetadata: ApplicationMetaData,
    sendEvent = true
  ): Promise<ApplicationWindow> {
    const targetedApplication = this._settings.settings.apps.installedApps.find(
      (x) => x.exeLocation === iconMetadata.exeLocation
    );

    if (!targetedApplication) {
      ErrorManager.applicationNotFoundError();
      throw new Error();
    }

    const applicationWindow = await this._window.Application(iconMetadata);

    const applicationInstance = this.getApplicationFromOpenApps(
      targetedApplication.applicationIdentifier
    );

    if (applicationInstance instanceof ApplicationInstance) {
      applicationInstance.applicationWindows.push(applicationWindow);
    } else {
      this.openApps.push(
        new ApplicationInstance({
          instanceId: GenerateUUID(),
          applicationId: targetedApplication.applicationIdentifier,
          applicationWindows: [applicationWindow],
        })
      );
    }

    if (sendEvent) {
      this.SendDataToApp<null>(
        applicationWindow.windowOptions.windowIdentifier,
        null,
        "system",
        EventName.StartedApplication
      );
    }

    return applicationWindow;
  }

  public CheckIfAppIsOpen(windowHash: string): boolean {
    return this.openApps.some((app) =>
      app.applicationWindows.some(
        (window) => window.windowOptions.windowIdentifier === windowHash
      )
    );
  }

  public CloseExecutable(targetWindowHash: string) {
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

    if (targetWindowIndex !== -1) {
      this.openApps[targetApplicationInstanceIndex].applicationWindows[
        targetWindowIndex
      ].Destroy();
    }

    this.openApps[targetApplicationInstanceIndex].applicationWindows.splice(
      targetWindowIndex,
      1
    );

    if (
      !this.openApps[targetApplicationInstanceIndex].applicationWindows.length
    ) {
      this.openApps.splice(targetApplicationInstanceIndex, 1);
    }
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

  private FindInstalledAppsWithMimetype = (
    mimeType: MimeTypes
  ): Array<ApplicationMetaData> =>
    this.installedApps.filter((app) => app.mimeTypes.includes(mimeType));

  private getApplicationFromOpenApps(
    applicationId: string
  ): ApplicationInstance | boolean {
    const applicationInstance = this.openApps.find(
      (instance) => instance.applicationId === applicationId
    );

    if (applicationInstance) return applicationInstance;
    else return false;
  }
}

export default ApplicationManager;
