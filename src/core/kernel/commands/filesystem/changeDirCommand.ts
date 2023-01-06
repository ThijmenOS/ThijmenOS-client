import { Path, Permissions } from "@thijmen-os/common";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import { EventName } from "@ostypes/AppManagerTypes";
import { ChangeDirectory } from "@providers/filesystemEndpoints/filesystem";

class ChangeDirCommand implements ICommand {
  private props: Path;

  readonly requiredPermission = Permissions.fileSystem;

  constructor(props: Path) {
    this.props = props;
  }

  public async Handle(): Promise<CommandReturn<string>> {
    const result = await ChangeDirectory(this.props);

    return new CommandReturn(result, EventName.SelfInvoked);
  }
}

export default ChangeDirCommand;
