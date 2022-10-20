import { ApplicationMetaDataObject } from "@interface/application/applicationProperties";
import { directory } from "./fileSystemTypes";

export interface IFileSystem {
  ShowFilesInDir(path: string): Promise<Array<directory>>;
  OpenFile(path: string): Promise<string>;
  FetchInstalledApplications(): Promise<Array<ApplicationMetaDataObject>>;
}
