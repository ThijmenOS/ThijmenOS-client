import { ICommand } from "@ostypes/CommandTypes";
import ProcessesShape from "@core/processManager/interfaces/processesShape";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { BaseProcess } from "@core/processManager/processes/baseProcess";
import { errors, success } from "../errors";
import Exit from "@providers/error/systemErrors/Exit";

class Terminate implements ICommand {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  private _pid?: number;

  constructor(pid?: number) {
    this._pid = pid;
  }

  Handle(Process?: BaseProcess): number {
    if (Process && !this._pid) {
      this._pid = Process.pid;
    }

    if (!this._pid) {
      return errors.ParameterError;
    }

    const result = this._processes.FindProcess(this._pid);
    if (result instanceof Exit) {
      return -1;
    }

    result.Terminate(0);

    return success;
  }
}

export default Terminate;
