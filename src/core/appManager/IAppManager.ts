import FileIcon from "@drivers/graphic/fileIcon/FileIcon";
import Window from "@drivers/graphic/window/Window";
import { OpenFile } from "@ostypes/KernelTypes";

export default interface IAppManager {
  FetchInstalledApps(): Promise<void>;
  openApplicationWithMimeType(requestingApp: string, props: OpenFile): void;
  OpenApplication(applicationDetails: FileIcon): Window;
  CheckIfAppExists(appName: string): boolean;
  CloseApplication(targetWindow: string): void;
  SendDataToApp<T>(app: string, data: T, sender: string): void;
}
