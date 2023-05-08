import ProcessesShape from "@core/processManager/interfaces/processesShape";
import { BaseProcess } from "@core/processManager/processes/baseProcess";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import Exit from "@providers/error/systemErrors/Exit";

class WaitPid implements ICommand {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  private _pid: number;

  constructor(pid: number) {
    this._pid = pid;
  }

  Handle(): Exit | number {
    const processAlive = this._processes.FindProcess(this._pid);

    if (processAlive instanceof BaseProcess) return 0;

    return 1;
  }
}

export default WaitPid;
