import { IAppManager } from "@interface/appManager";
import { IFileSystem } from "@interface/fileSystem/fileSystem";

export interface ICore {
  fileSystem: IFileSystem;
  appManager: IAppManager;
}
