import ProcessesShape from "@core/processManager/interfaces/processesShape";
import { BaseProcess } from "@core/processManager/processes/baseProcess";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import Exit from "@providers/error/systemErrors/Exit";

class CreateMessageBus implements ICommand {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  private _bufferSize?: number;
  private _targetPid: number;

  constructor(targetPid: number, bufferSize?: number) {
    this._targetPid = targetPid;
    this._bufferSize = bufferSize;
  }

  Handle(process?: BaseProcess): Exit {
    if (!process) return new Exit(-1);

    const status = this._processes.CreateMessageBus(
      process.pid,
      this._targetPid,
      this._bufferSize
    );
    return status;
  }
}

export default CreateMessageBus;
