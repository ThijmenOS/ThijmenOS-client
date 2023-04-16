import { ICommand } from "@ostypes/CommandTypes";
import Processes from "@core/processManager/processes";
import { Process } from "@core/processManager/interfaces/baseProcess";

class Terminate extends Processes implements ICommand {
  private _pid: string;

  constructor(pid: string) {
    super();

    this._pid = pid;
  }

  Handle(Process?: Process): void {
    if (Process) {
      this._pid = Process.processIdentifier;
    }

    const targetProcess = this.FindProcess(this._pid);
    if (!targetProcess) {
      return;
    }

    targetProcess.Terminate();
    this.RemoveApplicationInstance(this._pid);
  }
}

export default Terminate;
