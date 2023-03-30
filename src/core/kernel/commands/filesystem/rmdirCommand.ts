import { Access, Path, Permissions } from "@thijmen-os/common";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import { RemoveDirectory } from "@providers/filesystemEndpoints/filesystem";
import CommandAccessValidation from "@core/kernel/accessValidation";
import { EventName } from "@ostypes/ProcessTypes";

class rmdirCommand extends CommandAccessValidation implements ICommand {
  private props: Path;

  readonly requiredPermission = Permissions.fileSystem;

  constructor(props: Path) {
    super();

    this.props = props;
  }

  public async Handle(): Promise<CommandReturn<boolean | null>> {
    const validated = this.validateAccess(this.props, Access.w);
    if (!validated) return new CommandReturn<null>(null, EventName.NoAccess);

    const result = await RemoveDirectory(this.props);

    const eventName = result
      ? EventName.DirectoryRemoved
      : EventName.DirectoryDoesNotExist;

    return new CommandReturn<boolean>(result, eventName);
  }
}

export default rmdirCommand;
