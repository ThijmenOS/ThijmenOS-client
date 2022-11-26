import ICore from "@core/core/ICore";
import { ICommand } from "@ostypes/CommandTypes";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { OpenFileType } from "@ostypes/KernelTypes";

class OpenFileCommand implements ICommand {
  private readonly _core: ICore = javascriptOs.get<ICore>(types.Core);
  private readonly props: OpenFileType;

  constructor(props: OpenFileType) {
    this.props = props;
  }

  Handle(): void {
    this._core.appManager.OpenFile(this.props);
  }
}

export default OpenFileCommand;
