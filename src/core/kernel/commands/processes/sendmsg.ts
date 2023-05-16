import ProcessesShape from "@core/processManager/interfaces/processesShape";
import { BaseProcess } from "@core/processManager/processes/baseProcess";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import Exit from "@providers/error/systemErrors/Exit";
import MqFlag from "@core/processManager/types/messageQueueFlags";
import MessagebufferExceeded from "@core/processManager/errors/messageBufferExceeded";

class SendMsg implements ICommand {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  private _msqId: number;
  private _message: string | number;

  constructor(args: { msqId: number; message: string | number }) {
    this._msqId = args.msqId;
    this._message = args.message;
  }

  Handle(process: BaseProcess): string | number | null {
    const messageBus = this._processes.FindMessageBus(this._msqId);
    if (messageBus instanceof Exit) return -1;

    const session = messageBus.FindSession(process.pid);
    if (session instanceof Exit) return -1;

    if (session.flags.includes(MqFlag.RDONLY)) {
      return -1;
    }

    const status = messageBus.Send(this._message);
    if (status instanceof MessagebufferExceeded) return -1;

    return 0;
  }
}

export default SendMsg;
