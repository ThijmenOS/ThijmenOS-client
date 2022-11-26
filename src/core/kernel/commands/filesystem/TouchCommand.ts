import { Mkdir } from "@thijmen-os/common";
import { CreateFile } from "@thijmen-os/filesystem";
import { ICommand } from "@ostypes/CommandTypes";
import IAppManager from "@core/appManager/IAppManager";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";

class TouchCommand implements ICommand {
  private appManager: IAppManager = javascriptOs.get<IAppManager>(
    types.AppManager
  );
  private props: Mkdir;
  constructor(props: Mkdir) {
    this.props = props;
  }
  public async Handle(): Promise<void> {
    await CreateFile(this.props);

    this.appManager.RefreshDesktopApps();
  }
}

export default TouchCommand;
