import { ICommand } from "@ostypes/CommandTypes";
import ProcessesShape from "@core/processManager/interfaces/processesShape";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import Exit from "@providers/error/systemErrors/Exit";
import { BaseProcess } from "@core/processManager/processes/baseProcess";

class Terminate implements ICommand {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  private _pid?: number;

  constructor(pid?: number) {
    this._pid = pid;
  }

  Handle(Process?: BaseProcess): Exit {
    if (Process && !this._pid) {
      this._pid = Process.pid;
    }

    if (!this._pid) {
      throw new Error("No target pid defined");
    }

    const result = this._processes.FindProcess(this._pid);
    if (result instanceof Exit) {
      return result;
    }

    const removed = this._processes.RemoveProcess(result.pid);
    console.log(removed);
    if (removed.id >= 0) {
      result.Terminate();
    }

    return new Exit();
  }
}

export default Terminate;
