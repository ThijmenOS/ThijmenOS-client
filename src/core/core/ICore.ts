import IAppManager from "@core/appManager/IAppManager";
import IFileSystem from "@drivers/fileSystem/IFileSystem";

export default interface ICore {
  fileSystem: IFileSystem;
  appManager: IAppManager;
}
