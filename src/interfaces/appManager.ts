import FileIcon from "fileIcon/fileIcon";

export interface IAppManager {
  FetchInstalledApps(): Promise<void>;
  openApplicationWithMimeType(requestingApp: string, mimeType: string): void;
  OpenApplication(applicationDetails: FileIcon): void;
  CheckIfAppExists(appName: string): boolean;
  CloseApplication(targetWindow: string): void;
  SendDataToApp<T>(app: string, data: T, sender: string): void;
}
