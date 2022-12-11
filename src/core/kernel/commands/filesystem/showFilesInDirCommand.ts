import { Directory, Path } from "@thijmen-os/common";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import { EventName } from "@ostypes/AppManagerTypes";
import { ShowFilesInDir } from "@providers/filesystemEndpoints/filesystem";

class ShowFilesInDirCommand implements ICommand {
  private props: Path;

  constructor(props: Path) {
    this.props = props;
  }

  public async Handle(): Promise<CommandReturn<Array<Directory>>> {
    const result = await ShowFilesInDir(this.props);

    return new CommandReturn(result, EventName.SelfInvoked);
  }
}

export default ShowFilesInDirCommand;
