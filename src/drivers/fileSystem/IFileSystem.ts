import {
  ApplicationMetaDataObject,
  Mkdir,
  OSSettings,
  Directory,
  Path,
} from "javascriptOS-common/types";

export default interface IFileSystem {
  ShowFilesInDir(path: string): Promise<Array<Directory>>;
  OpenFile(path: string): Promise<string>;
  FetchInstalledApplications(): Promise<Array<ApplicationMetaDataObject>>;
  FetchSettings(): Promise<OSSettings>;
  ChangeDirectory(path: Path): Promise<string>;
  MakeDirectory(props: Mkdir): Promise<string>;
  RemoveDirectory(props: Path): Promise<string>;
  CreateFile(props: string): Promise<string>;

  ChangeBackground(props: Path): Promise<string>;
  GetBackground(): Promise<string>;
}
