import IAppManager from "@core/appManager/IAppManager";
import ISettings from "@core/settings/ISettings";
import IFileSystem from "@drivers/fileSystem/IFileSystem";

export default interface ICore {
  fileSystem: IFileSystem;
  appManager: IAppManager;
  settings: ISettings;
}
