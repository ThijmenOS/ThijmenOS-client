import ProcessesShape from "@core/processManager/interfaces/processesShape";
import { BaseProcess } from "@core/processManager/processes/baseProcess";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import Exit from "@providers/error/systemErrors/Exit";

class ReadMsg implements ICommand {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  private _senderPid: number;

  constructor(pid: number) {
    this._senderPid = pid;
  }

  Handle(process: BaseProcess): string | number | null {
    const messageBus = this._processes.FindMessageBus(
      this._senderPid,
      process.pid
    );
    if (messageBus instanceof Exit) return null;

    return messageBus.Read();
  }
}

export default ReadMsg;
