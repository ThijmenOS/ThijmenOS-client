import { Access, Mkdir, Permissions } from "@thijmen-os/common";
import { ICommand } from "@ostypes/CommandTypes";
import { MakeDirectory } from "@providers/filesystemEndpoints/filesystem";
import javascriptOs from "@inversify/inversify.config";
import AccessValidationMethods from "@core/kernel/accessValidationMethods";
import types from "@ostypes/types";
import Exit from "@providers/error/systemErrors/Exit";
import NoResourceAccess from "./errors/NoResourceAccess";

class MkdirCommand implements ICommand {
  private readonly _cmdAccess = javascriptOs.get<AccessValidationMethods>(
    types.CommandAccessValidation
  );

  private readonly _props: Mkdir;

  public readonly requiredPermission = Permissions.fileSystem;
  private readonly _access = Access.w;

  constructor(props: Mkdir) {
    this._props = props;
  }

  public Handle(): Exit {
    const validated = this._cmdAccess.ValidateAccess(
      this._props.directoryPath,
      this._access
    );
    if (!validated) return new NoResourceAccess(this._props.directoryPath);

    MakeDirectory({
      props: this._props,
      userId: this._cmdAccess.UserId,
      access: this._cmdAccess.tempDefaultAccess,
    });

    return new Exit();
  }
}

export default MkdirCommand;
