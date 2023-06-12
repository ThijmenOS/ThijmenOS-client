import { Path, Permissions } from "@thijmen-os/common";
import { ICommand } from "@ostypes/CommandTypes";
import { ChangeDirectory } from "@providers/filesystemEndpoints/filesystem";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import FileSystem from "@core/fileSystem";
import { FileAccessOptions } from "@core/fileSystem/enums/fileAccess";

class ChangeDirCommand implements ICommand {
  private readonly _fileSystem = javascriptOs.get<FileSystem>(types.FileSystem);

  private readonly _props: Path;

  public readonly requiredPermission = Permissions.fileSystem;
  private readonly _access = FileAccessOptions.r;

  constructor(props: Path) {
    this._props = props;
  }

  public async Handle(): Promise<number | string> {
    const validated = this._fileSystem.ValidateAccess(
      this._props,
      this._access,
      false
    );
    if (!validated) return -1;

    const result = await ChangeDirectory(this._props);

    return result;
  }
}

export default ChangeDirCommand;
