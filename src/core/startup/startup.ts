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

//Interfaces
import UpdateTime from "@utils/updateTime";
import Kernel from "@core/kernel/kernelMethodShape";
import ApplicationManager from "@core/applicationManager/applicationManagerMethodShape";

//Types
import Settings from "@core/settings/settingsMethodShape";
import StartupMethodShape from "./startupMethodShape";
import AuthenticationMethodShape from "@providers/authentication/authenticationMethodShape";
import { User } from "@providers/authentication/user";

@injectable()
class Startup implements StartupMethodShape {
  private readonly _kernel: Kernel;
  private readonly _appManager: ApplicationManager;
  private readonly _settings: Settings;
  private readonly _authenticationGuiProvider: AuthenticationGuiShape;
  private readonly _authenticationProvider: AuthenticationMethodShape;

  constructor(
    @inject(types.Kernel) kernel: Kernel,
    @inject(types.AppManager) appManager: ApplicationManager,
    @inject(types.Settings) settings: Settings,
    @inject(types.AuthenticationGui) authenticationGui: AuthenticationGuiShape,
    @inject(types.Authentication) authentication: AuthenticationMethodShape
  ) {
    this._kernel = kernel;
    this._appManager = appManager;
    this._settings = settings;
    this._authenticationGuiProvider = authenticationGui;
    this._authenticationProvider = authentication;
  }

  public async InitialiseOperatingSystem() {
    await this._settings.Initialise();

    this._authenticationGuiProvider.Authenticate();

    document
      .querySelector("#thijmen-os-login-page")!
      .addEventListener("authenticated", () => this.userAuthenticated());

    UpdateTime();

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

  private async userAuthenticated() {
    await this._settings.Background().Get();
    this._kernel.ListenToCommunication();
    this._appManager.FetchInstalledApps();
    this._appManager.ShowFilesOnDesktop();
  }
}

export default Startup;
