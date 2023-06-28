import { ICommand } from "@ostypes/CommandTypes";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import FileSystem from "@core/fileSystem/interfaces/fileSystem";
import { FileAccessOptions } from "@core/fileSystem/enums/fileAccess";
import { BaseProcess } from "@core/processManager/processes/baseProcess";

class FOpen implements ICommand {
  private readonly _fileSystem = javascriptOs.get<FileSystem>(types.FileSystem);

  private readonly _path: string;
  private readonly _mode: FileAccessOptions;

  constructor(props: { path: string; mode: FileAccessOptions }) {
    this._path = props.path;
    this._mode = props.mode;
  }

  public async Handle(process: BaseProcess): Promise<string | number> {
    const validated = this._fileSystem.ValidateAccess(this._path, this._mode);

    if (!validated) return 1;
    if (validated.locked) return 2;

    validated.mode = this._mode;

    process.AddResource.file(validated);

    return validated.id;
  }
}

export default FOpen;
