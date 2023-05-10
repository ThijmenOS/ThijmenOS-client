import ProcessesShape from "@core/processManager/interfaces/processesShape";
import { BaseProcess } from "@core/processManager/processes/baseProcess";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import Exit from "@providers/error/systemErrors/Exit";
import { errors } from "../errors";

class CreateMessageBus implements ICommand {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  private _bufferSize?: number;
  private _targetPid: number;

  constructor(args: { targetPid: number; bufferSize?: number }) {
    this._targetPid = args.targetPid;
    this._bufferSize = args.bufferSize;
  }

  Handle(process?: BaseProcess): Exit {
    if (!process) return errors.UnkownError;

    const status = this._processes.CreateMessageBus(
      process.pid,
      this._targetPid,
      this._bufferSize
    );
    return status;
  }
}

export default CreateMessageBus;
