import FileIcon from "@drivers/graphic/fileIcon/FileIcon";
import Window from "@drivers/graphic/window/Window";
import { OpenFile } from "@ostypes/KernelTypes";
import { MimeTypes } from "@ostypes/SettingsTypes";
import { Path } from "@common/FileSystem";

export default interface IAppManager {
  FetchInstalledApps(): Promise<void>;
  OpenFileWithApplication(requestingApp: string, props: OpenFile): void;
  OpenExecutable(applicationDetails: FileIcon): Window;
  OpenFile(mimeType: MimeTypes, filePath: Path): Window;
  CheckIfAppIsOpen(appName: string): boolean;
  CloseExecutable(targetWindow: string): void;
  SendDataToApp<T>(
    app: string,
    data: T,
    sender: string,
    eventName: string
  ): void;
}
