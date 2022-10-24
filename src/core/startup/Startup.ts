import $ from "jquery";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import types from "@ostypes/types";
import { Directory } from "@ostypes/FileSystemTypes";
import IFileIcon from "@drivers/graphic/fileIcon/IFileIcon";
import IStartup from "./IStartup";
import IFileSystem from "@drivers/fileSystem/IFileSystem";
import IKernel from "@core/kernel/IKernel";
import IUtils from "@utils/IUtils";
import IAppManager from "@core/appManager/IAppManager";
import javascriptOs from "../../../inversify.config";

@injectable()
class Startup implements IStartup {
  private readonly _fileSystem: IFileSystem;
  private readonly _kernel: IKernel;
  private readonly _utils: IUtils;
  private readonly _appManager: IAppManager;

  constructor(
    @inject(types.FileSystem) fileSystem: IFileSystem,
    @inject(types.Kernel) kernel: IKernel,
    @inject(types.Utils) utils: IUtils,
    @inject(types.AppManager) appManager: IAppManager
  ) {
    this._fileSystem = fileSystem;
    this._kernel = kernel;
    this._utils = utils;
    this._appManager = appManager;
  }

  public InitialiseOperatingSystem() {
    this._appManager.FetchInstalledApps();
    this._kernel.ListenToCommunication();

    this._utils.UpdateTime();

    this.showFilesOnDesktop();

    onresize = () => {
      const pageWidth = window.innerWidth;
      $("#display-too-small").css(
        "display",
        pageWidth >= 1000 ? "none" : "block"
      );
    };
    setInterval(() => {
      this._utils.UpdateTime();
    }, 1000);
  }

  private async showFilesOnDesktop() {
    this._fileSystem
      .ShowFilesInDir("C/Desktop")
      .then((res: Array<Directory>) => {
        Array.from(res).forEach((file) => {
          javascriptOs
            .get<IFileIcon>(types.FileIcon)
            .ConstructFileIcon(file.filePath);
        });
      });
  }
}

export default Startup;
