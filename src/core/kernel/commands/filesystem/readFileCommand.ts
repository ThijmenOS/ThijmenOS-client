import { Access, Path, Permissions } from "@thijmen-os/common";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import { EventName } from "@ostypes/AppManagerTypes";
import { OpenFile } from "@providers/filesystemEndpoints/filesystem";
import CommandAccessValidation from "@core/kernel/accessValidation";

class ReadFileCommand extends CommandAccessValidation implements ICommand {
  private props: Path;

  readonly requiredPermission = Permissions.fileSystem;

  constructor(props: Path) {
    super();

    this.props = props;
  }

  public async Handle(): Promise<CommandReturn<string>> {
    const validated = this.validateAccess(this.props, Access.w);
    if (!validated) return new CommandReturn("", EventName.NoAccess);

    const result: string = await OpenFile(this.props);

    return new CommandReturn(result, EventName.SelfInvoked);
  }
}

export default ReadFileCommand;
