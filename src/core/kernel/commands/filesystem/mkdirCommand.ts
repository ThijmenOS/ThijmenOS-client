import { Mkdir, Permissions } from "@thijmen-os/common";
import { ICommand } from "@ostypes/CommandTypes";
import { MakeDirectory } from "@providers/filesystemEndpoints/filesystem";

class mkdirCommand implements ICommand {
  private props: Mkdir;

  readonly requiredPermission = Permissions.fileSystem;

  constructor(props: Mkdir) {
    this.props = props;
  }

  public Handle(): void {
    MakeDirectory(this.props);
  }
}

export default mkdirCommand;
