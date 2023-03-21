//DI
import "reflect-metadata";
import { injectable, inject } from "inversify";
import types from "@ostypes/types";

//Interfaces
import UpdateTime from "@utils/updateTime";
import Kernel from "@core/kernel/kernelMethodShape";
import ApplicationManager from "@core/ApplicationManager/ApplicationManagerMethods";

//Types
import Settings from "@core/settings/settingsMethodShape";
import StartupMethodShape from "./startupMethodShape";
import AuthenticationMethodShape from "@providers/authentication/authenticationMethodShape";
import DesktopMethods from "@providers/desktop/desktopMethods";

@injectable()
class Startup implements StartupMethodShape {
  private readonly _kernel: Kernel;
  private readonly _appManager: ApplicationManager;
  private readonly _settings: Settings;
  private readonly _authenticationGuiProvider: AuthenticationGuiShape;
  private readonly _authenticationProvider: AuthenticationMethodShape;
  private readonly _desktop: DesktopMethods;

  constructor(
    @inject(types.Kernel) kernel: Kernel,
    @inject(types.AppManager) appManager: ApplicationManager,
    @inject(types.Settings) settings: Settings,
    @inject(types.AuthenticationGui) authenticationGui: AuthenticationGuiShape,
    @inject(types.Authentication) authentication: AuthenticationMethodShape,
    @inject(types.Desktop) desktop: DesktopMethods
  ) {
    this._kernel = kernel;
    this._appManager = appManager;
    this._settings = settings;
    this._authenticationGuiProvider = authenticationGui;
    this._authenticationProvider = authentication;
    this._desktop = desktop;
  }

  public async InitialiseOperatingSystem() {
    await this._settings.Initialise();
    this._kernel.loadKernel();

    const userAuthenticated =
      this._authenticationProvider.CheckAuthenticationState();

    if (!userAuthenticated) {
      this._authenticationGuiProvider.Authenticate();

      const loginPage = document.querySelector("#thijmen-os-login-page")!;

      loginPage.addEventListener("authenticated", () => {
        this.userAuthenticated();
      });
    } else {
      this._authenticationGuiProvider.RemoveAuthorization();
      this.userAuthenticated();
    }

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
    this._appManager.FetchInstalledApps();
    this._desktop.LoadDesktop();
  }
}

export default Startup;
