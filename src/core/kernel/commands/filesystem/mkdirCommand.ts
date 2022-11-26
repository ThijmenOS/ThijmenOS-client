import { Mkdir } from "@thijmen-os/common";
import { MakeDirectory } from "@thijmen-os/filesystem";
import { ICommand } from "@ostypes/CommandTypes";

class mkdirCommand implements ICommand {
  private props: Mkdir;

  constructor(props: Mkdir) {
    this.props = props;
  }

  public Handle(): void {
    MakeDirectory(this.props);
  }
}

export default mkdirCommand;
