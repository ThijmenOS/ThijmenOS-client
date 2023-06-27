import ProcessesShape from "@core/processManager/interfaces/processesShape";
import { BaseProcess } from "@core/processManager/processes/baseProcess";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import MqFlag from "@core/processManager/types/messageQueueFlags";
import Exit from "@providers/error/systemErrors/Exit";

class OpenMessageQueue implements ICommand {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  private _name: string;
  private _flags: MqFlag[];
  private _bufferSize?: number;

  constructor(args: {
    name: string;
    flags: Array<MqFlag>;
    bufferSize?: number;
  }) {
    this._name = args.name;
    this._flags = args.flags;
    this._bufferSize = args.bufferSize;
  }

  Handle(process: BaseProcess): number {
    const result = this._processes.OpenMessageQueue(
      process.pid,
      this._name,
      this._flags,
      this._bufferSize
    );

    if (result instanceof Exit) {
      return -1;
    }

    return result.messageBusId;
  }
}

export default OpenMessageQueue;
