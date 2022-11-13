import FileIcon from "@drivers/graphic/fileIcon/FileIcon";
import { Window } from "@thijmenos/window";
import { OpenFileType } from "@ostypes/KernelTypes";

export default interface IAppManager {
  FetchInstalledApps(): Promise<void>;
  OpenFileWithApplication(props: OpenFileType): void;
  OpenExecutable(applicationDetails: FileIcon): Window;
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
