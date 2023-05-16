import { Access, Path, Permissions } from "@thijmen-os/common";
import { ICommand } from "@ostypes/CommandTypes";
import { OpenFile } from "@providers/filesystemEndpoints/filesystem";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import AccessValidationMethods from "@core/kernel/accessValidationMethods";
import { errors } from "../errors";

class ReadFileCommand implements ICommand {
  private readonly _cmdAccess = javascriptOs.get<AccessValidationMethods>(
    types.CommandAccessValidation
  );

  private readonly _props: Path;

  public readonly requiredPermission = Permissions.fileSystem;
  private readonly _access = Access.r;

  constructor(props: Path) {
    this._props = props;
  }

  public async Handle(): Promise<string | number> {
    const validated = this._cmdAccess.ValidateAccess(this._props, this._access);
    if (!validated) return errors.NoResourceAccess;

    const result = await OpenFile(this._props);

    return result;
  }
}

export default ReadFileCommand;
