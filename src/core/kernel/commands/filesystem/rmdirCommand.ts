import { Path } from "@thijmen-os/common";
import { ICommand } from "@ostypes/CommandTypes";
import { RemoveDirectory } from "@providers/filesystemEndpoints/filesystem";

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
