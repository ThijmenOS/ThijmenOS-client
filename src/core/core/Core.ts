/* <Class Documentation>

  <Class Description>
    The core class is the core functionallity for the kernel. The kernel can access all its nesecery methods trough here

*/

//DI
import { inject, injectable } from "inversify";
import types from "@ostypes/types";

//classes
import FileSystem from "drivers/fileSystem/FileSystem";

//DI interfaces
import IAppManager from "../appManager/IAppManager";
import ICore from "./ICore";
import IFileSystem from "@drivers/fileSystem/IFileSystem";

@injectable()
class Core implements ICore {
  public fileSystem: FileSystem;
  public appManager: IAppManager;

  constructor(
    @inject(types.FileSystem) fileSystem: IFileSystem,
    @inject(types.AppManager) appManager: IAppManager
  ) {
    this.fileSystem = fileSystem;
    this.appManager = appManager;
  }
}

export default Core;
