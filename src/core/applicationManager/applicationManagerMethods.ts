import { ApplicationMetaData, MimeTypes } from "@thijmen-os/common";

interface ApplicationManager {
  FindInstalledAppsWithMimetype(
    mimeType: MimeTypes
  ): Array<ApplicationMetaData>;
  FetchInstalledApps(): Promise<void>;
  CheckIfApplicationIsAvailableProcess(
    applicationIdentifier: string
  ): ApplicationMetaData;
  FindApplicationByIdentifier(identifier: string): ApplicationMetaData | null;
}

export default ApplicationManager;
