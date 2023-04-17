import { ICommand } from "@ostypes/CommandTypes";
import { Process } from "@core/processManager/interfaces/baseProcess";
import ProcessesShape from "@core/processManager/interfaces/processesShape";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";

class Terminate implements ICommand {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  private _targetPid: string;

  constructor(targetPid: string) {
    this._targetPid = targetPid;
  }

  Handle(Process?: Process): void {
    if (Process) {
      this._targetPid = Process.processIdentifier;
    }

    const targetProcess = this._processes.FindProcess(this._targetPid);
    if (!targetProcess) {
      return;
    }

    targetProcess.Terminate();
    this._processes.RemoveProcess(this._targetPid);
  }
}

export default Terminate;
