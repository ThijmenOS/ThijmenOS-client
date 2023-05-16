import ProcessesShape from "@core/processManager/interfaces/processesShape";
import { ProcessState } from "@core/processManager/types/processState";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import Exit from "@providers/error/systemErrors/Exit";

class Kill implements ICommand {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  private _pid: number;
  private _exitCode?: number;

  constructor(args: { pid: number; exitCode?: number }) {
    this._pid = args.pid;
    this._exitCode = args.exitCode;
  }

  //TODO: in feature, make it only possible for root applications (somehow find out how to make root applications) and parent processes to kill processes
  Handle() {
    const targetProcess = this._processes.FindProcess(this._pid);
    if (targetProcess instanceof Exit) return -1;

    if (targetProcess.state === ProcessState.Terminated) return -1;

    targetProcess.Terminate(this._exitCode ?? 0);

    return 0;
  }
}

export default Kill;
