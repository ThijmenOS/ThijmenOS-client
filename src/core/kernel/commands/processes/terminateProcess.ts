import { ICommand } from "@ostypes/CommandTypes";
import { Process } from "@core/processManager/interfaces/process";
import ProcessesShape from "@core/processManager/interfaces/processesShape";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import Exit from "@providers/error/systemErrors/Exit";

class Terminate implements ICommand {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  private _targetPid?: string;

  constructor(targetPid?: string) {
    this._targetPid = targetPid;
  }

  Handle(Process?: Process): Exit {
    if (Process && !this._targetPid) {
      this._targetPid = Process.processIdentifier;
    }

    if (!this._targetPid) {
      throw new Error("No target pid defined");
    }

    const result = this._processes.FindProcess(this._targetPid);
    if (result instanceof Exit) {
      return result;
    }

    const removed = this._processes.RemoveProcess(result.processIdentifier);
    if (removed.id >= 0) {
      result.Terminate();
    }

    return new Exit();
  }
}

export default Terminate;
