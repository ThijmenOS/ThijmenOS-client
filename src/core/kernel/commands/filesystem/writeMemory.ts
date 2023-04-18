import MemoryMethodShape from "@core/memory/memoryMethodShape";
import { Process } from "@core/processManager/interfaces/baseProcess";
import javascriptOs from "@inversify/inversify.config";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import Exit from "@providers/error/systemErrors/Exit";
import types from "@ostypes/types";
import { EventName } from "@ostypes/ProcessTypes";
import ParameterError from "@providers/error/systemErrors/paramError";

class WriteMemory implements ICommand {
  private readonly _memory = javascriptOs.get<MemoryMethodShape>(types.Memory);

  private _memoryKey: string;
  private _data: any;

  constructor(args: { memoryKey: string; data: unknown }) {
    this._memoryKey = args.memoryKey;
    this._data = args.data;
  }

  public Handle(Process: Process): Exit | CommandReturn<unknown> {
    if (!this._memoryKey) {
      return new ParameterError("WriteMemory");
    }

    const result = this._memory.SaveToMemory(
      Process.processIdentifier,
      this._memoryKey,
      this._data
    );

    if (result instanceof Exit) {
      return result;
    }

    return new CommandReturn(result, EventName.WriteMemory);
  }
}

export default WriteMemory;
