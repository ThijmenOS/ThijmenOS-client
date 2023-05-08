import MemoryAccess from "@core/memory/models/memoryAccess";
import MemoryMethodShape from "@core/memory/memoryMethodShape";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import Exit from "@providers/error/systemErrors/Exit";
import types from "@ostypes/types";
import ParameterError from "@providers/error/systemErrors/paramError";
import { ProcessV2 } from "@core/processManager/processes/process";

class AllocateMemory implements ICommand {
  private readonly _memory = javascriptOs.get<MemoryMethodShape>(types.Memory);

  private _memoryKey: string;
  private _memoryAccess: Array<MemoryAccess>;

  constructor(args: { memoryKey: string; memoryAccess: Array<MemoryAccess> }) {
    this._memoryKey = args.memoryKey;
    this._memoryAccess = args.memoryAccess;
  }

  public Handle(Process: ProcessV2): Exit {
    if (!this._memoryAccess || !this._memoryKey) {
      return new ParameterError();
    }

    const result = this._memory.AllocateMemory(
      Process.pid,
      this._memoryKey,
      this._memoryAccess
    );

    return result;
  }
}

export default AllocateMemory;
