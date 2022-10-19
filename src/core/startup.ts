import $ from "jquery";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import types from "@interface/types";
import FileSystem from "@core/fileSystem";
import { directory } from "@interface/fileSystem/fileSystemTypes";
import { IFileIcon } from "@interface/fileIcon";
import { IStartup } from "@interface/startup";
import { IFileSystem } from "@interface/fileSystem/fileSystem";
import { IKernel } from "@interface/kernel/kernel";
import { IUtils } from "@interface/utils/utils";
import { IAppManager } from "@interface/appManager";

@injectable()
class Startup implements IStartup {
  private readonly _fileSystem: FileSystem;
  private readonly _fileIcon: IFileIcon;
  private readonly _kernel: IKernel;
  private readonly _utils: IUtils;
  private readonly _appManager: IAppManager;

  constructor(
    @inject(types.FileIcon) fileIcon: IFileIcon,
    @inject(types.FileSystem) fileSystem: IFileSystem,
    @inject(types.Kernel) kernel: IKernel,
    @inject(types.Utils) utils: IUtils,
    @inject(types.AppManager) appManager: IAppManager
  ) {
    this._fileIcon = fileIcon;
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
      let pageWidth = window.innerWidth;
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
      .then((res: Array<directory>) => {
        Array.from(res).forEach((file) => {
          this._fileIcon.ConstructFileIcon(file.filePath);
        });
      });
  }
}

export default Startup;
