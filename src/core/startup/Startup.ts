/* <Class Documentation>

  <Class Description>
    The startup class calls every method that is needed to startup the operating system. So it starts listening for app requests, it finds all the desktop apps and more

  <Method Description>
    InitialiseOperatingSystem(): Calls all the methods to start the operating system
    ShowFilesOnDesktop(): Fetches all the files on the desktop directory

*/

//DI
import "reflect-metadata";
import { injectable, inject } from "inversify";
import types from "@ostypes/types";
import javascriptOs from "../../../inversify.config";

//Interfaces
import IFileIcon from "@drivers/graphic/fileIcon/IFileIcon";
import IStartup from "./IStartup";
import IFileSystem from "@drivers/fileSystem/IFileSystem";
import IKernel from "@core/kernel/IKernel";
import IUtils from "@utils/IUtils";
import IAppManager from "@core/appManager/IAppManager";

//Types
import { Directory } from "javascriptOS-common/types";
import ISettings from "@core/settings/ISettings";

@injectable()
class Startup implements IStartup {
  private readonly _fileSystem: IFileSystem;
  private readonly _kernel: IKernel;
  private readonly _utils: IUtils;
  private readonly _appManager: IAppManager;
  private readonly _settings: ISettings;

  constructor(
    @inject(types.FileSystem) fileSystem: IFileSystem,
    @inject(types.Kernel) kernel: IKernel,
    @inject(types.Utils) utils: IUtils,
    @inject(types.AppManager) appManager: IAppManager,
    @inject(types.Settings) settings: ISettings
  ) {
    this._fileSystem = fileSystem;
    this._kernel = kernel;
    this._utils = utils;
    this._appManager = appManager;
    this._settings = settings;
  }

  private async ShowFilesOnDesktop() {
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

  public async InitialiseOperatingSystem() {
    await this._settings.Initialise();
    await this._settings.Background().Get();
    this._kernel.ListenToCommunication();
    this._appManager.FetchInstalledApps();

    this._utils.UpdateTime();

    this.ShowFilesOnDesktop();

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
}

export default Startup;
