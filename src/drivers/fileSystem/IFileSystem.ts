import { ApplicationMetaDataObject } from "@ostypes/ApplicationTypes";
import { Directory } from "@ostypes/FileSystemTypes";

export default interface IFileSystem {
  ShowFilesInDir(path: string): Promise<Array<Directory>>;
  OpenFile(path: string): Promise<string>;
  FetchInstalledApplications(): Promise<Array<ApplicationMetaDataObject>>;
}
