import { Access, Path, Permissions } from "@thijmen-os/common";
import { ICommand } from "@ostypes/CommandTypes";
import { ChangeDirectory } from "@providers/filesystemEndpoints/filesystem";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import AccessValidationMethods from "@core/kernel/accessValidationMethods";
import { errors } from "../errors";

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
    if (!validated) return errors.NoResourceAccess;

    const result = await ChangeDirectory(this._props);

    return result;
  }
}

export default ChangeDirCommand;
