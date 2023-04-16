//DI
import { inject, injectable } from "inversify";
import types from "@ostypes/types";

//DI interfaces
import ProcessManagerMethods from "./applicationManagerMethods";

//Types
import { ApplicationMetaData, MimeTypes } from "@thijmen-os/common";
import Settings from "@core/settings/settingsMethodShape";
import ApplicationNotFoundError from "@providers/error/userErrors/applicationNotFound";

@injectable()
class ApplicationManager implements ProcessManagerMethods {
  private readonly _settings: Settings;

  private _availableApplications: Array<ApplicationMetaData> = [];

  constructor(@inject(types.Settings) settings: Settings) {
    this._settings = settings;
  }

  public async FetchInstalledApps(): Promise<void> {
    this._availableApplications =
      this._settings.Settings.applications.installedApplications;
  }

  public FindApplicationByIdentifier(
    identifier: string
  ): ApplicationMetaData | null {
    //If it is not found, application is not registered and you have to execute it by execution path
    const applicationDetails = this._availableApplications.find(
      (application) => application.applicationIdentifier === identifier
    );

    if (!applicationDetails) {
      return null;
    }

    return applicationDetails;
  }

  public FindInstalledAppsWithMimetype = (
    mimeType: MimeTypes
  ): Array<ApplicationMetaData> =>
    this._availableApplications.filter((app) =>
      app.mimeTypes.includes(mimeType)
    );

  public CheckIfApplicationIsAvailableProcess(
    applicationIdentifier: string
  ): ApplicationMetaData {
    const result = this._availableApplications.find(
      (application) =>
        application.applicationIdentifier === applicationIdentifier
    );

    if (typeof result === "undefined") {
      throw new ApplicationNotFoundError(
        "The targeted application could not be found!"
      );
    }

    return result;
  }
}

export default ApplicationManager;
