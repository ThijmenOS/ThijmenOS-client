import MemoryAccess from "@core/memory/models/memoryAccess";
import MemoryMethodShape from "@core/memory/memoryMethodShape";
import { Process } from "@core/processManager/interfaces/baseProcess";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import Exit from "@providers/error/systemErrors/Exit";
import types from "@ostypes/types";
import ParameterError from "@providers/error/systemErrors/paramError";

class AllocateMemory implements ICommand {
  private readonly _memory = javascriptOs.get<MemoryMethodShape>(types.Memory);

  private _memoryKey: string;
  private _memoryAccess: Array<MemoryAccess>;

  constructor(args: { memoryKey: string; memoryAccess: Array<MemoryAccess> }) {
    this._memoryKey = args.memoryKey;
    this._memoryAccess = args.memoryAccess;
  }

  public Handle(Process: Process): Exit {
    if (!this._memoryAccess || !this._memoryKey) {
      return new ParameterError("AllocMem");
    }

    const result = this._memory.AllocateMemory(
      Process.processIdentifier,
      this._memoryKey,
      this._memoryAccess
    );

    if (result instanceof Exit) {
      return result;
    }

    return new Exit();
  }
}

export default AllocateMemory;
