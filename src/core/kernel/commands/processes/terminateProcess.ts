import { ICommand } from "@ostypes/CommandTypes";
import Processes from "@core/processManager/processes";
import { Process } from "@core/processManager/interfaces/baseProcess";

class Terminate extends Processes implements ICommand {
  private _targetPid: string;

  constructor(targetPid: string) {
    super();

    this._targetPid = targetPid;
  }

  Handle(Process?: Process): void {
    if (Process) {
      this._targetPid = Process.processIdentifier;
    }

    const targetProcess = this.FindProcess(this._targetPid);
    if (!targetProcess) {
      return;
    }

    targetProcess.Terminate();
    this.RemoveApplicationInstance(this._targetPid);
  }
}

export default Terminate;
