import ProcessesShape from "@core/processManager/interfaces/processesShape";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import Exit from "@providers/error/systemErrors/Exit";

class ReadMsg implements ICommand {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  private _pid: number;

  constructor(pid: number) {
    this._pid = pid;
  }

  Handle(): string | number | null | Exit {
    const messageBus = this._processes.FindMessageBus(this._pid);
    if (messageBus instanceof Exit) return new Exit(-1);

    return messageBus.Read();
  }
}

export default ReadMsg;
