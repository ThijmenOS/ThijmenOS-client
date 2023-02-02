import { Access, Directory, Path, Permissions } from "@thijmen-os/common";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import { EventName } from "@ostypes/AppManagerTypes";
import { ShowFilesInDir } from "@providers/filesystemEndpoints/filesystem";
import CommandAccessValidation from "@core/kernel/accessValidation";

class ShowFilesInDirCommand
  extends CommandAccessValidation
  implements ICommand
{
  private props: Path;

  public readonly requiredPermission = Permissions.fileSystem;

  constructor(props: Path) {
    super();

    this.props = props;
  }

  public async Handle(): Promise<CommandReturn<Array<Directory>>> {
    const validated = this.validateAccess(this.props, Access.r);
    if (!validated) return new CommandReturn([], EventName.NoAccess);

    const result = await ShowFilesInDir(this.props);

    return new CommandReturn(result, EventName.SelfInvoked);
  }
}

export default ShowFilesInDirCommand;
