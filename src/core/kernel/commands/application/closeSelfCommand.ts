import ICore from "@core/core/ICore";
import { ICommand } from "@ostypes/CommandTypes";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";

class CloseSelfCommand implements ICommand {
  private readonly _core: ICore = javascriptOs.get<ICore>(types.Core);
  private readonly target: string;

  constructor(target: string) {
    this.target = target;
  }

  Handle(): void {
    this._core.appManager.CloseExecutable(this.target);
  }
}

export default CloseSelfCommand;
