import { ApplicationMetaDataObject } from "@ostypes/ApplicationTypes";
import { Mkdir } from "@common/FileSystem";
import { OSSettings } from "@ostypes/SettingsTypes";
import { Directory, Path } from "@common/FileSystem";

export default interface IFileSystem {
  ShowFilesInDir(path: string): Promise<Array<Directory>>;
  OpenFile(path: string): Promise<string>;
  FetchInstalledApplications(): Promise<Array<ApplicationMetaDataObject>>;
  FetchSettings(): Promise<OSSettings>;
  ChangeDirectory(path: Path): Promise<string>;
  MakeDirectory(props: Mkdir): Promise<string>;
  RemoveDirectory(props: Path): Promise<string>;
  CreateFile(props: string): Promise<string>;
}
