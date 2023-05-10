import { ICommand } from "@ostypes/CommandTypes";
import ProcessesShape from "@core/processManager/interfaces/processesShape";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import Exit from "@providers/error/systemErrors/Exit";
import { BaseProcess } from "@core/processManager/processes/baseProcess";

class ExitProcess implements ICommand {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  private _code: number;

  constructor(code: number) {
    this._code = code;
  }

  Handle(process: BaseProcess): Exit {
    const result = this._processes.FindProcess(process.pid);
    if (result instanceof Exit) {
      return result;
    }

    result.Terminate(this._code);

    return new Exit(this._code);
  }
}

export default ExitProcess;
