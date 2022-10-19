import FileIcon from "@app/file-icon/fileIcon";

export interface IAppManager {
  FetchInstalledApps(): Promise<void>;
  openApplicationWithMimeType(mimeType: string): void;
  OpenApplication(applicationDetails: FileIcon): void;
  CheckIfAppExists(appName: string): boolean;
  CloseApplication(targetWindow: string): void;
  SendDataToApp(app: string, data: string | object, sender: string): void;
}
