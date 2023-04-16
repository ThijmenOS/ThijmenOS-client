import { Access, Directory, Path, Permissions } from "@thijmen-os/common";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import { EventName } from "@ostypes/ProcessTypes";
import { ShowFilesInDir } from "@providers/filesystemEndpoints/filesystem";
import CommandAccessValidation from "@core/kernel/accessValidation";

class ListFilesCommand extends CommandAccessValidation implements ICommand {
  private _props: Path;

  public readonly requiredPermission = Permissions.fileSystem;

  constructor(props: Path) {
    super();

    this._props = props;
  }

  public async Handle(): Promise<CommandReturn<Array<Directory>>> {
    const validated = this.ValidateAccess(this._props, Access.r);
    if (!validated) return new CommandReturn([], EventName.NoAccess);

    const result = await ShowFilesInDir(this._props);

    return new CommandReturn(result, EventName.ListFiles);
  }
}

export default ListFilesCommand;
