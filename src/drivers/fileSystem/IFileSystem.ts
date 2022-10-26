import { ApplicationMetaDataObject } from "@ostypes/ApplicationTypes";
import { Directory } from "@ostypes/FileSystemTypes";
import { Path } from "@ostypes/KernelTypes";
import { OSSettings } from "@ostypes/SettingsTypes";

export default interface IFileSystem {
  ShowFilesInDir(path: string): Promise<Array<Directory>>;
  OpenFile(path: string): Promise<string>;
  FetchInstalledApplications(): Promise<Array<ApplicationMetaDataObject>>;
  FetchSettings(): Promise<OSSettings>;
  ChangeDirectory(path: Path): Promise<string>;
}
