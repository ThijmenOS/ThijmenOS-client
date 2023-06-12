import { Mkdir, Permissions } from "@thijmen-os/common";
import { ICommand } from "@ostypes/CommandTypes";
import { MakeDirectory } from "@providers/filesystemEndpoints/filesystem";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { success } from "../errors";
import FileSystem from "@core/fileSystem/interfaces/fileSystem";
import { FileAccessOptions } from "@core/fileSystem/enums/fileAccess";

class MkdirCommand implements ICommand {
  private readonly _fileSystem = javascriptOs.get<FileSystem>(types.FileSystem);

  private readonly _props: Mkdir;

  public readonly requiredPermission = Permissions.fileSystem;
  private readonly _access = FileAccessOptions.w;

  constructor(props: Mkdir) {
    this._props = props;
  }

  public Handle(): number {
    const validated = this._fileSystem.ValidateAccess(
      this._props.directoryPath,
      this._access
    );
    if (!validated) return -1;

    MakeDirectory({
      props: this._props,
      userId: validated.userId,
      access: validated.access,
    });

    this._fileSystem.RegisterFile(
      this._props.directoryPath + "/" + this._props.name,
      validated.userId,
      validated.access
    );

    return success;
  }
}

export default MkdirCommand;
