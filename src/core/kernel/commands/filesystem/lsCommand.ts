import { Directory, Path, Permissions } from "@thijmen-os/common";
import { ICommand } from "@ostypes/CommandTypes";
import { ShowFilesInDir } from "@providers/filesystemEndpoints/filesystem";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import FileSystem from "@core/fileSystem/interfaces/fileSystem";
import { FileAccessOptions } from "@core/fileSystem/enums/fileAccess";

class Ls implements ICommand {
  private readonly _fileSystem = javascriptOs.get<FileSystem>(types.FileSystem);

  private _props: Path;

  public readonly requiredPermission = Permissions.fileSystem;
  private readonly _access = FileAccessOptions.r;

  constructor(props: Path) {
    this._props = props;
  }

  public async Handle(): Promise<number | Array<Directory>> {
    const validated = this._fileSystem.ValidateAccess(
      this._props,
      this._access
    );

    if (!validated) return 1;

    const result = await ShowFilesInDir(this._props);

    return result;
  }
}

export default Ls;
