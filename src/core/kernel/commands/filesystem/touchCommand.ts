import { Mkdir, Permissions } from "@thijmen-os/common";
import { ICommand } from "@ostypes/CommandTypes";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { CreateFile } from "@providers/filesystemEndpoints/filesystem";
import DesktopMethods from "@providers/desktop/desktopMethods";
import FileSystem from "@core/fileSystem/interfaces/fileSystem";
import { FileAccessOptions } from "@core/fileSystem/enums/fileAccess";

class TouchCommand implements ICommand {
  private readonly _desktop = javascriptOs.get<DesktopMethods>(types.Desktop);
  private readonly _fileSystem = javascriptOs.get<FileSystem>(types.FileSystem);

  private _props: Mkdir;

  readonly requiredPermission = Permissions.fileSystem;
  private readonly _access = FileAccessOptions.w;

  constructor(props: Mkdir) {
    this._props = props;
  }
  public async Handle(): Promise<number> {
    const validated = this._fileSystem.ValidateAccess(
      this._props.directoryPath,
      this._access
    );
    if (!validated) return 1;

    const fh = this._fileSystem.RegisterFile(
      this._props.directoryPath + "/" + this._props.name,
      validated.userId,
      validated.access
    );

    if (!fh) return 2;

    await CreateFile({
      props: this._props,
      userId: validated.userId,
      access: validated.access,
    });

    this._desktop.RefreshDesktop();

    console.log(fh);

    return fh.id;
  }
}

export default TouchCommand;
