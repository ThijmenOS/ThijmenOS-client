import FileSystem from "@core/fileSystem";
import { IAppManager } from "@interface/appManager";
import { ICore } from "@interface/core/core";
import { IFileSystem } from "@interface/fileSystem/fileSystem";
import types from "@interface/types";
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
