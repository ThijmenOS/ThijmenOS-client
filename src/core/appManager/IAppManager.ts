import FileIcon from "@drivers/graphic/fileIcon/FileIcon";
import Window from "@drivers/graphic/window/Window";
import { OpenFile, Path } from "@ostypes/KernelTypes";
import { MimeTypes } from "@ostypes/SettingsTypes";

export default interface IAppManager {
  FetchInstalledApps(): Promise<void>;
  openApplicationWithMimeType(requestingApp: string, props: OpenFile): void;
  OpenExecutable(applicationDetails: FileIcon): Window;
  OpenFile(mimeType: MimeTypes, filePath: Path): Window;
  CheckIfAppExists(appName: string): boolean;
  CloseApplication(targetWindow: string): void;
  SendDataToApp<T>(app: string, data: T, sender: string): void;
}
