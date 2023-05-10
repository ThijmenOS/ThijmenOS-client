import ProcessesShape from "@core/processManager/interfaces/processesShape";
import { BaseProcess } from "@core/processManager/processes/baseProcess";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import Exit from "@providers/error/systemErrors/Exit";
import { errors } from "../errors";

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

  Handle(process: BaseProcess): string | number | null {
    const messageBus = this._processes.FindMessageBus(
      process.pid,
      this._receivingPid
    );

    if (typeof messageBus === "number") return errors.MessageBusNotFound;

    return messageBus.Send(this._message);
  }
}

export default SendMsg;
