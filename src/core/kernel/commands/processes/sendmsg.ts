import ProcessesShape from "@core/processManager/interfaces/processesShape";
import { BaseProcess } from "@core/processManager/processes/baseProcess";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import Exit from "@providers/error/systemErrors/Exit";

class SendMsg implements ICommand {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  private _receivingPid: number;
  private _message: string | number;

  constructor(args: { receivingPid: number; message: string | number }) {
    this._receivingPid = args.receivingPid;
    this._message = args.message;
  }

  Handle(process: BaseProcess): string | number | null | Exit {
    const messageBus = this._processes.FindMessageBus(
      process.pid,
      this._receivingPid
    );

    if (messageBus instanceof Exit) return new Exit(-1, messageBus.data);

    return messageBus.Send(this._message);
  }
}

export default SendMsg;
