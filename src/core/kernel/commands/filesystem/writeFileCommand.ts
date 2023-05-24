import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import { Access, Path } from "@thijmen-os/common";
import { writeFile } from "@providers/filesystemEndpoints/filesystem";
import AccessValidationMethods from "@core/kernel/accessValidationMethods";

interface WriteFileCommandArgs {
  path: Path;
  content: string;
}
class WriteFileCommand implements ICommand {
  private readonly _cmdAccess = javascriptOs.get<AccessValidationMethods>(
    types.CommandAccessValidation
  );

  private _path: string;
  private _content: string;

  private readonly _access = Access.r;

  constructor(args: WriteFileCommandArgs) {
    this._path = args.path;
    this._content = args.content;
  }

  public async Handle(): Promise<number> {
    const validated = this._cmdAccess.ValidateAccess(this._path, this._access);
    if (!validated) return -1;

    const result = await writeFile({
      path: this._path,
      content: this._content,
    });

    if (!result) {
      return -1;
    }

    return 0;
  }
}

export default WriteFileCommand;
