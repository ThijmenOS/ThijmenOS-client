import FileSystem from "drivers/fileSystem/FileSystem";
import IAppManager from "../appManager/IAppManager";
import ICore from "./ICore";
import IFileSystem from "@drivers/fileSystem/IFileSystem";
import types from "@ostypes/types";
import { inject, injectable } from "inversify";

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
