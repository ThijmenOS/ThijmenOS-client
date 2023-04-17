import { Access, Path, Permissions } from "@thijmen-os/common";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import { RemoveDirectory } from "@providers/filesystemEndpoints/filesystem";
import { EventName } from "@ostypes/ProcessTypes";
import AccessValidationMethods from "@core/kernel/accessValidationMethods";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import Exit from "@providers/error/systemErrors/Exit";
import NoResourceAccess from "./errors/NoResourceAccess";
import ResourceDoesNotExist from "./errors/ResourceDoesNotExist";

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

  public async Handle(): Promise<CommandReturn<boolean> | Exit> {
    const validated = this._cmdAccess.ValidateAccess(this._props, this._access);
    if (!validated) return new NoResourceAccess(this._props);

    const result = await RemoveDirectory(this._props);

    if (!result) return new ResourceDoesNotExist(this._props);

    return new CommandReturn<boolean>(result, EventName.DirectoryRemoved);
  }
}

export default RmdirCommand;
