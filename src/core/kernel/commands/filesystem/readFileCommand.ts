import { Access, Path, Permissions } from "@thijmen-os/common";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import { EventName } from "@ostypes/ProcessTypes";
import { OpenFile } from "@providers/filesystemEndpoints/filesystem";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import AccessValidationMethods from "@core/kernel/accessValidationMethods";
import Exit from "@providers/error/systemErrors/Exit";
import NoResourceAccess from "./errors/NoResourceAccess";

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

  public async Handle(): Promise<CommandReturn<string> | Exit> {
    const validated = this._cmdAccess.ValidateAccess(this._props, this._access);
    if (!validated) return new NoResourceAccess(this._props);

    const result: string = await OpenFile(this._props);

    return new CommandReturn(result, EventName.SelfInvoked);
  }
}

export default ReadFileCommand;
