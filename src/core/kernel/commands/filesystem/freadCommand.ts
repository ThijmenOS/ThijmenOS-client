import { ICommand } from "@ostypes/CommandTypes";
import { BaseProcess } from "@core/processManager/processes/baseProcess";
import { Open } from "@providers/filesystemEndpoints/filesystem";

class FRead implements ICommand {
  private readonly _fileHandle: number;

  constructor(fileHandle: number) {
    this._fileHandle = fileHandle;
  }

  public async Handle(process: BaseProcess): Promise<string | number> {
    const fileHandle = process.fileHandles.find(
      (handle) => handle.id === this._fileHandle
    );

    if (!fileHandle) return 1;
    if (fileHandle.locked) return 2;

    const content = await Open(fileHandle.path);

    if (typeof content !== "string") return 3;

    return content;
  }
}

export default FRead;
