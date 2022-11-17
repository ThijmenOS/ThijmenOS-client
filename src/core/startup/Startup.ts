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
import IFileIcon from "@core/fileIcon/IFileIcon";
import IStartup from "./IStartup";
import { UpdateTime } from "@thijmenos/utils";
import { ShowFilesInDir } from "@thijmenos/filesystem";
import IKernel from "@core/kernel/IKernel";
import IAppManager from "@core/appManager/IAppManager";

//Types
import { Directory } from "@thijmenos/common";
import ISettings from "@core/settings/ISettings";

@injectable()
class Startup implements IStartup {
  private readonly _kernel: IKernel;
  private readonly _appManager: IAppManager;
  private readonly _settings: ISettings;

  constructor(
    @inject(types.Kernel) kernel: IKernel,
    @inject(types.AppManager) appManager: IAppManager,
    @inject(types.Settings) settings: ISettings
  ) {
    this._kernel = kernel;
    this._appManager = appManager;
    this._settings = settings;
  }

  private async ShowFilesOnDesktop() {
    ShowFilesInDir("C/Desktop").then((res: Array<Directory>) => {
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

    UpdateTime();

    this.ShowFilesOnDesktop();

    onresize = () => {
      const pageWidth = window.innerWidth;
      $("#display-too-small").css(
        "display",
        pageWidth >= 1000 ? "none" : "block"
      );
    };
    setInterval(() => {
      UpdateTime();
    }, 1000);
  }
}

export default Startup;
