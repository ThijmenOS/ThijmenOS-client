import { Path, Permissions } from "@thijmen-os/common";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import { EventName } from "@ostypes/AppManagerTypes";
import { OpenFile } from "@providers/filesystemEndpoints/filesystem";

class ReadFileCommand implements ICommand {
  private props: Path;

  readonly requiredPermission = Permissions.fileSystem;

  constructor(props: { path: Path }) {
    this.props = props.path;
  }

  public async Handle(): Promise<CommandReturn<string>> {
    const result: string = await OpenFile(this.props);

    return new CommandReturn(result, EventName.SelfInvoked);
  }
}

export default ReadFileCommand;
