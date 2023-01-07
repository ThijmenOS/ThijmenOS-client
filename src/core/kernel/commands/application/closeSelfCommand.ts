import { ICommand } from "@ostypes/CommandTypes";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import ApplicationManager from "@core/applicationManager/applicationManagerMethodShape";

class CloseSelfCommand implements ICommand {
  private readonly _applicationManager: ApplicationManager =
    javascriptOs.get<ApplicationManager>(types.AppManager);
  private readonly target: string;

  constructor(target: string) {
    this.target = target;
  }

  Handle(): void {
    this._applicationManager.CloseExecutable(this.target);
  }
}

export default CloseSelfCommand;
