import MemoryAccess from "@core/memory/models/memoryAccess";
import MemoryMethodShape from "@core/memory/memoryMethodShape";
import { Process } from "@core/processManager/interfaces/baseProcess";
import javascriptOs from "@inversify/inversify.config";
import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import { ErrorExit } from "@providers/error/systemErrors/systemError";
import types from "@ostypes/types";
import MemKeyAlreadyAllocated from "@core/memory/errors/MemKeyAlreadyAllocated";
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

  public Handle(Process: Process): ErrorExit | CommandReturn<unknown> {
    if (!this._memoryKey) {
      return new ParameterError("WriteMemory");
    }

    const dataWritten = this._memory.SaveToMemory(
      Process.processIdentifier,
      this._memoryKey,
      this._data
    );

    if (dataWritten instanceof ErrorExit) {
      return dataWritten;
    }

    return new CommandReturn(dataWritten, EventName.WriteMemory);
  }
}

export default WriteMemory;
