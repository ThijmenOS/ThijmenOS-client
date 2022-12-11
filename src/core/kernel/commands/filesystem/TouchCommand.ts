import { Mkdir } from "@thijmen-os/common";
import { ICommand } from "@ostypes/CommandTypes";
import IAppManager from "@core/applicationManager/applicationManagerMethodShape";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { CreateFile } from "@providers/filesystemEndpoints/filesystem";

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
