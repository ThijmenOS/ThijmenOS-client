import { Path } from "@thijmen-os/common";
import { ChangeDirectory } from "@thijmen-os/filesystem";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import { EventName } from "@ostypes/AppManagerTypes";

class ChangeDirCommand implements ICommand {
  private props: Path;

  constructor(props: Path) {
    this.props = props;
  }

  public async Handle(): Promise<CommandReturn<string>> {
    const result = await ChangeDirectory(this.props);

    return new CommandReturn(result, EventName.SelfInvoked);
  }
}

export default ChangeDirCommand;
