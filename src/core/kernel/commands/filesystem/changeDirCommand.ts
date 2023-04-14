import { Access, Path, Permissions } from "@thijmen-os/common";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import { EventName } from "@ostypes/ProcessTypes";
import { ChangeDirectory } from "@providers/filesystemEndpoints/filesystem";
import CommandAccessValidation from "@core/kernel/accessValidation";

class ChangeDirCommand extends CommandAccessValidation implements ICommand {
  private readonly _props: Path;

  readonly requiredPermission = Permissions.fileSystem;

  constructor(props: Path) {
    super();

    this._props = props;
  }

  public async Handle(): Promise<CommandReturn<string>> {
    const validated = this.ValidateAccess(this._props, Access.r);
    if (!validated) return new CommandReturn("", EventName.NoAccess);

    const result = await ChangeDirectory(this._props);

    return new CommandReturn(result, EventName.SelfInvoked);
  }
}

export default ChangeDirCommand;
