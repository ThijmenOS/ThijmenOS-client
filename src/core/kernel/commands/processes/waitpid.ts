import ProcessesShape from "@core/processManager/interfaces/processesShape";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import { ProcessState } from "@core/processManager/types/processState";
import Exit from "@providers/error/systemErrors/Exit";

class WaitPid implements ICommand {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  private _pid: number;

  constructor(pid: number) {
    this._pid = pid;
  }

  Handle(): number {
    const process = this._processes.FindProcess(this._pid);
    if (process instanceof Exit) return -1;

    if (process.state === ProcessState.Terminated) {
      return process.exitCode;
    }

    return -1;
  }
}

export default WaitPid;
