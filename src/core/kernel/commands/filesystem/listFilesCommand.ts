import { Access, Directory, Path, Permissions } from "@thijmen-os/common";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import { ShowFilesInDir } from "@providers/filesystemEndpoints/filesystem";
import javascriptOs from "@inversify/inversify.config";
import AccessValidationMethods from "@core/kernel/accessValidationMethods";
import types from "@ostypes/types";
import Exit from "@providers/error/systemErrors/Exit";
import NoResourceAccess from "./errors/NoResourceAccess";

class ListFilesCommand implements ICommand {
  private readonly _cmdAccess = javascriptOs.get<AccessValidationMethods>(
    types.CommandAccessValidation
  );

  private _props: Path;

  public readonly requiredPermission = Permissions.fileSystem;
  private readonly _access = Access.r;

  constructor(props: Path) {
    this._props = props;
  }

  public async Handle(): Promise<Exit | Exit<Array<Directory>>> {
    const validated = this._cmdAccess.ValidateAccess(this._props, this._access);
    if (!validated) return new NoResourceAccess();

    const result = await ShowFilesInDir(this._props);

    return new CommandReturn(result);
  }
}

export default ListFilesCommand;
