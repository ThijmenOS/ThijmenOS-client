import { Access, Path, Permissions } from "@thijmen-os/common";
import { ICommand } from "@ostypes/CommandTypes";
import { ValidatePath } from "@providers/filesystemEndpoints/filesystem";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import AccessValidationMethods from "@core/kernel/accessValidationMethods";

class ChangeDirCommand implements ICommand {
  private readonly _cmdAccess = javascriptOs.get<AccessValidationMethods>(
    types.CommandAccessValidation
  );

  private readonly _props: Path;

  public readonly requiredPermission = Permissions.fileSystem;
  private readonly _access = Access.r;

  constructor(props: Path) {
    this._props = props;
  }

  public async Handle(): Promise<number | string> {
    const validated = this._cmdAccess.ValidateAccess(this._props, this._access);
    if (!validated) return -1;

    const result = await ValidatePath(this._props);

    return result;
  }
}

export default ChangeDirCommand;
