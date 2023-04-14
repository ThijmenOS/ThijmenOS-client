import { Access, Mkdir, Permissions } from "@thijmen-os/common";
import { ICommand } from "@ostypes/CommandTypes";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { CreateFile } from "@providers/filesystemEndpoints/filesystem";
import DesktopMethods from "@providers/desktop/desktopMethods";
import CommandAccessValidation from "@core/kernel/accessValidation";

class TouchCommand extends CommandAccessValidation implements ICommand {
  private _desktop: DesktopMethods = javascriptOs.get<DesktopMethods>(
    types.Desktop
  );

  private _props: Mkdir;

  readonly requiredPermission = Permissions.fileSystem;

  constructor(props: Mkdir) {
    super();

    this._props = props;
  }
  public async Handle(): Promise<void> {
    const validated = this.ValidateAccess(this._props.directoryPath, Access.w);
    if (!validated) return;

    const userId = this.LoadUserData().userId;

    await CreateFile({
      props: this._props,
      userId: userId,
      access: this.tempDefaultAccess,
    });

    this._desktop.RefreshDesktop();
  }
}

export default TouchCommand;
