import { Access, Path, Permissions } from "@thijmen-os/common";
import { ICommand } from "@ostypes/CommandTypes";
import { RemoveDirectory } from "@providers/filesystemEndpoints/filesystem";
import CommandAccessValidation from "@core/kernel/accessValidation";

class rmdirCommand extends CommandAccessValidation implements ICommand {
  private props: Path;

  readonly requiredPermission = Permissions.fileSystem;

  constructor(props: Path) {
    super();

    this.props = props;
  }

  public Handle(): void {
    const validated = this.validateAccess(this.props, Access.w);
    if (!validated) return;

    RemoveDirectory(this.props);
  }
}

export default rmdirCommand;
