import MemoryMethodShape from "@core/memory/memoryMethodShape";
import { Process } from "@core/processManager/interfaces/baseProcess";
import javascriptOs from "@inversify/inversify.config";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import { ErrorExit } from "@providers/error/systemErrors/systemError";
import types from "@ostypes/types";
import { EventName } from "@ostypes/ProcessTypes";
import ParameterError from "@providers/error/systemErrors/paramError";

class ReadMemory implements ICommand {
  private readonly _memory = javascriptOs.get<MemoryMethodShape>(types.Memory);

  private _memoryKey: string;

  constructor(memoryKey: string) {
    this._memoryKey = memoryKey;
  }

  public Handle(Process: Process): ErrorExit | CommandReturn<unknown> {
    if (!this._memoryKey) {
      return new ParameterError("ReadMemory");
    }

    const data = this._memory.LoadFromMemory(
      Process.processIdentifier,
      this._memoryKey
    );

    if (data instanceof ErrorExit) {
      return data;
    }

    return new CommandReturn(data, EventName.WriteMemory);
  }
}

export default ReadMemory;
