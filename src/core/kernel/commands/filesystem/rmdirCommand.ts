import { Path } from "@thijmen-os/common";
import { RemoveDirectory } from "@thijmen-os/filesystem";
import { ICommand } from "@ostypes/CommandTypes";

class rmdirCommand implements ICommand {
  private props: Path;

  constructor(props: Path) {
    this.props = props;
  }

  public Handle(): void {
    RemoveDirectory(this.props);
  }
}

export default rmdirCommand;
