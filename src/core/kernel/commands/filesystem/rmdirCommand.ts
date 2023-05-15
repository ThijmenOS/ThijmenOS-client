import { Access, Path, Permissions } from "@thijmen-os/common";
import { ICommand } from "@ostypes/CommandTypes";
import { RemoveDirectory } from "@providers/filesystemEndpoints/filesystem";
import AccessValidationMethods from "@core/kernel/accessValidationMethods";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { errors, success } from "../errors";

class RmdirCommand implements ICommand {
  private readonly _cmdAccess = javascriptOs.get<AccessValidationMethods>(
    types.CommandAccessValidation
  );

  private readonly _props: Path;

  readonly requiredPermission = Permissions.fileSystem;
  private readonly _access = Access.w;

  constructor(props: Path) {
    this._props = props;
  }

  public async Handle(): Promise<number> {
    const validated = this._cmdAccess.ValidateAccess(this._props, this._access);
    if (!validated) errors.NoResourceAccess;

    const result = await RemoveDirectory(this._props);

    if (!result) return errors.ResourceDoesNotExist;

    return success;
  }
}

export default RmdirCommand;
