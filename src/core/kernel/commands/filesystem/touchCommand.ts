import { Mkdir, Permissions } from "@thijmen-os/common";
import { ICommand } from "@ostypes/CommandTypes";
import IAppManager from "@core/applicationManager/applicationManagerMethodShape";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { CreateFile } from "@providers/filesystemEndpoints/filesystem";
import DesktopMethods from "@providers/desktop/desktopMethods";

class TouchCommand implements ICommand {
  private _desktop: DesktopMethods = javascriptOs.get<DesktopMethods>(
    types.Desktop
  );

  private props: Mkdir;

  readonly requiredPermission = Permissions.fileSystem;

  constructor(props: Mkdir) {
    this.props = props;
  }
  public async Handle(): Promise<void> {
    await CreateFile(this.props);

    this._desktop.RefreshDesktop();
  }
}

export default TouchCommand;
