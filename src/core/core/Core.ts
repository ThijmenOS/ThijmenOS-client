/* <Class Documentation>

  <Class Description>
    The core class is the core functionallity for the kernel. The kernel can access all its nesecery methods trough here

*/

//DI
import { inject, injectable } from "inversify";
import types from "@ostypes/types";

//classes

//DI interfaces
import IAppManager from "../appManager/IAppManager";
import ICore from "./ICore";
import ISettings from "@core/settings/ISettings";

@injectable()
class Core implements ICore {
  public appManager: IAppManager;
  public settings: ISettings;

  constructor(
    @inject(types.AppManager) appManager: IAppManager,
    @inject(types.Settings) settings: ISettings
  ) {
    this.appManager = appManager;
    this.settings = settings;
  }
}

export default Core;
