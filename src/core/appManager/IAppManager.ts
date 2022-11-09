import FileIcon from "@drivers/graphic/fileIcon/FileIcon";
import Window from "@drivers/graphic/window/Window";
import { OpenFile } from "@ostypes/KernelTypes";

export default interface IAppManager {
  FetchInstalledApps(): Promise<void>;
  OpenFileWithApplication(props: OpenFile): void;
  OpenExecutable(applicationDetails: FileIcon): Window;
  OpenFile(file: OpenFile): void;
  CheckIfAppIsOpen(appName: string): boolean;
  CloseExecutable(targetWindow: string): void;
  SendDataToApp<T>(
    app: string,
    data: T,
    sender: string,
    eventName: string
  ): void;
}
