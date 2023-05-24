import ProcessesShape from "@core/processManager/interfaces/processesShape";
import { BaseProcess } from "@core/processManager/processes/baseProcess";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";

class CloseMessageBus implements ICommand {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  private _msbId: number;

  constructor(msbId: number) {
    this._msbId = msbId;
  }

  Handle(process?: BaseProcess): number {
    if (!process) return -1;

    const result = this._processes.FreeMessageBus(this._msbId, process.pid);
    if (result.code !== 0) return -1;

    return 0;
  }
}

export default CloseMessageBus;
