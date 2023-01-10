import { Path, Permissions } from "@thijmen-os/common";
import { ICommand } from "@ostypes/CommandTypes";
import { RemoveDirectory } from "@providers/filesystemEndpoints/filesystem";

class rmdirCommand implements ICommand {
  private props: Path;

  readonly requiredPermission = Permissions.fileSystem;

  constructor(props: { path: Path }) {
    this.props = props.path;
  }

  public Handle(): void {
    RemoveDirectory(this.props);
  }
}

export default rmdirCommand;
