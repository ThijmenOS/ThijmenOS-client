import { Window } from "@thijmenos/window";
import { OpenFileType } from "@ostypes/KernelTypes";
import { IconMetadata } from "@thijmenos/common";

export default interface IAppManager {
  FetchInstalledApps(): Promise<void>;
  OpenFileWithApplication(props: OpenFileType): void;
  OpenExecutable(applicationDetails: IconMetadata): Window;
  OpenFile(file: OpenFileType): void;
  CheckIfAppIsOpen(appName: string): boolean;
  CloseExecutable(targetWindow: string): void;
  SendDataToApp<T>(
    app: string,
    data: T,
    sender: string,
    eventName: string
  ): void;
}
