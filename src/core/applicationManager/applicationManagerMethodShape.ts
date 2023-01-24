import ApplicationWindow from "@core/applicationWindow/applicationWindow";
import { OpenFileType } from "@core/kernel/kernelTypes";
import { IconMetadata } from "@thijmen-os/common";

interface ApplicationManager {
  FetchInstalledApps(): Promise<void>;
  ShowFilesOnDesktop(): Promise<void>;
  FindCorrespondingAppWithWindowHash(target: string): string;
  RefreshDesktopApps(): Promise<void>;
  OpenFileWithApplication(props: OpenFileType): void;
  OpenExecutable(applicationDetails: IconMetadata): Promise<ApplicationWindow>;
  OpenFile(file: OpenFileType): Promise<boolean>;
  CheckIfAppIsOpen(appName: string): boolean;
  CloseExecutable(targetWindow: string): void;
  SendDataToApp<T>(
    app: string,
    data: T,
    sender: string,
    eventName: string
  ): void;
}

export default ApplicationManager;
