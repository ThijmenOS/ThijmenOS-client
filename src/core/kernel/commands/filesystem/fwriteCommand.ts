import { ICommand } from "@ostypes/CommandTypes";
import { BaseProcess } from "@core/processManager/processes/baseProcess";
import { WriteFile } from "@providers/filesystemEndpoints/filesystem";
import { FileAccessOptions } from "@core/fileSystem/enums/fileAccess";

class FWrite implements ICommand {
  private readonly _fileHandle: number;
  private readonly _content: string;

  constructor(props: { fileHandle: number; content: string }) {
    this._fileHandle = props.fileHandle;
    this._content = props.content;
  }

  public async Handle(process: BaseProcess): Promise<string | number> {
    const fileHandle = process.fileHandles.find(
      (handle) => (handle.id = this._fileHandle)
    );

    if (
      !fileHandle ||
      fileHandle.locked ||
      fileHandle?.mode !== FileAccessOptions.w
    )
      return -1;

    console.log(fileHandle);

    const result = await WriteFile({
      path: fileHandle.path,
      content: this._content,
    });

    if (!result) return -1;

    return 0;
  }
}

export default FWrite;
