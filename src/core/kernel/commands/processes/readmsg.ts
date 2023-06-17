/* eslint-disable no-debugger */
import ReadMSGModes from "@core/kernel/models/readMsgModes";
import ProcessesShape from "@core/processManager/interfaces/processesShape";
import MessageBus from "@core/processManager/ipc/messageBus";
import { BaseProcess } from "@core/processManager/processes/baseProcess";
import MqFlag from "@core/processManager/types/messageQueueFlags";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import Exit from "@providers/error/systemErrors/Exit";

class ReadMsg implements ICommand {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  private _msqId: number;
  private _mode?: ReadMSGModes;

  constructor(props: { msqId: number; mode?: ReadMSGModes }) {
    this._msqId = props.msqId;
    this._mode = props.mode;
  }

  async Handle(process: BaseProcess): Promise<string | number | null> {
    const messageBus = this._processes.FindMessageBus(this._msqId);
    if (messageBus instanceof Exit) return 1;

    const session = messageBus.FindSession(process.pid);
    if (session instanceof Exit) return 2;

    if (session.flags.includes(MqFlag.WRONLY)) {
      return 3;
    }

    if (this._mode === ReadMSGModes.BLOCK) {
      return await this.AsyncRead(messageBus);
    }

    return messageBus.Read();
  }

  private async AsyncRead(messageBus: MessageBus): Promise<string | number> {
    let interval: NodeJS.Timer;

    const messageExists = new Promise<string | number>((resolve) => {
      interval = setInterval(() => {
        const res = messageBus.Read();

        if (res !== null) resolve(res);
      }, 100);
    });

    const message = messageExists.then((msg) => {
      clearInterval(interval);

      return msg;
    });

    return await message;
  }
}

export default ReadMsg;
