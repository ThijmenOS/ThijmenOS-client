import { Access, Mkdir, Permissions } from "@thijmen-os/common";
import { ICommand } from "@ostypes/CommandTypes";
import { MakeDirectory } from "@providers/filesystemEndpoints/filesystem";
import CommandAccessValidation from "@core/kernel/accessValidation";

class mkdirCommand extends CommandAccessValidation implements ICommand {
  private props: Mkdir;

  readonly requiredPermission = Permissions.fileSystem;

  constructor(props: Mkdir) {
    super();

    this.props = props;
  }

  public Handle(): void {
    const validated = this.validateAccess(this.props.directoryPath, Access.w);
    if (!validated) return;

    const userId = this.loadUserData().userId;

    MakeDirectory({
      props: this.props,
      userId: userId,
      access: this.tempDefaultAccess,
    });
  }
}

export default mkdirCommand;
