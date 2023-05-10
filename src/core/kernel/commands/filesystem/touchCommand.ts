import { Access, Mkdir, Permissions } from "@thijmen-os/common";
import { ICommand } from "@ostypes/CommandTypes";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { CreateFile } from "@providers/filesystemEndpoints/filesystem";
import DesktopMethods from "@providers/desktop/desktopMethods";
import AccessValidationMethods from "@core/kernel/accessValidationMethods";
import Exit from "@providers/error/systemErrors/Exit";
import { errors, success } from "../errors";

class TouchCommand implements ICommand {
  private _desktop = javascriptOs.get<DesktopMethods>(types.Desktop);
  private readonly _cmdAccess = javascriptOs.get<AccessValidationMethods>(
    types.CommandAccessValidation
  );

  private _props: Mkdir;

  readonly requiredPermission = Permissions.fileSystem;
  private readonly _access = Access.w;

  constructor(props: Mkdir) {
    this._props = props;
  }
  public async Handle(): Promise<Exit> {
    const validated = this._cmdAccess.ValidateAccess(
      this._props.directoryPath,
      this._access
    );
    if (!validated) return errors.NoResourceAccess;

    await CreateFile({
      props: this._props,
      userId: this._cmdAccess.UserId,
      access: this._cmdAccess.tempDefaultAccess,
    });

    this._desktop.RefreshDesktop();
    return success;
  }
}

export default TouchCommand;
