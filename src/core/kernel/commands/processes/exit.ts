import { ICommand } from "@ostypes/CommandTypes";
import ProcessesShape from "@core/processManager/interfaces/processesShape";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { BaseProcess } from "@core/processManager/processes/baseProcess";

class ExitProcess implements ICommand {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  private _code: number;

  constructor(code: number) {
    this._code = code;
  }

  Handle(process: BaseProcess): number {
    const result = this._processes.FindProcess(process.pid);
    if (typeof result === "number") {
      return result;
    }

    result.Terminate(this._code);
    console.log(`process exited with code ${this._code}`);

    return this._code;
  }
}

export default ExitProcess;
