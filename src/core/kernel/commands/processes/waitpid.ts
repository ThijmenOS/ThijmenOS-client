import ProcessesShape from "@core/processManager/interfaces/processesShape";
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
    const process = this._processes.FindProcess(this._pid);

    if (process instanceof Exit)
      return new Exit(-1, `could not find process with pid ${this._pid}`);

    return process.exitCode;
  }
}

export default WaitPid;
