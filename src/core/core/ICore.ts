import IAppManager from "@core/appManager/IAppManager";
import ISettings from "@core/settings/ISettings";

export default interface ICore {
  appManager: IAppManager;
  settings: ISettings;
}
