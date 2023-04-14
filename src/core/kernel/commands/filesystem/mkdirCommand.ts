import { Access, Mkdir, Permissions } from "@thijmen-os/common";
import { ICommand } from "@ostypes/CommandTypes";
import { MakeDirectory } from "@providers/filesystemEndpoints/filesystem";
import CommandAccessValidation from "@core/kernel/accessValidation";

class MkdirCommand extends CommandAccessValidation implements ICommand {
  private readonly _props: Mkdir;

  readonly requiredPermission = Permissions.fileSystem;

  constructor(props: Mkdir) {
    super();

    this._props = props;
  }

  public Handle(): void {
    const validated = this.ValidateAccess(this._props.directoryPath, Access.w);
    if (!validated) return;

    const userId = this.LoadUserData().userId;

    MakeDirectory({
      props: this._props,
      userId: userId,
      access: this.tempDefaultAccess,
    });
  }
}

export default MkdirCommand;
