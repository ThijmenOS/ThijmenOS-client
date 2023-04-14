import { Access, Path, Permissions } from "@thijmen-os/common";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import { RemoveDirectory } from "@providers/filesystemEndpoints/filesystem";
import CommandAccessValidation from "@core/kernel/accessValidation";
import { EventName } from "@ostypes/ProcessTypes";

class RmdirCommand extends CommandAccessValidation implements ICommand {
  private readonly _props: Path;

  readonly requiredPermission = Permissions.fileSystem;

  constructor(props: Path) {
    super();

    this._props = props;
  }

  public async Handle(): Promise<CommandReturn<boolean | null>> {
    const validated = this.ValidateAccess(this._props, Access.w);
    if (!validated) return new CommandReturn<null>(null, EventName.NoAccess);

    const result = await RemoveDirectory(this._props);

    const eventName = result
      ? EventName.DirectoryRemoved
      : EventName.DirectoryDoesNotExist;

    return new CommandReturn<boolean>(result, eventName);
  }
}

export default RmdirCommand;
