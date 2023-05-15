import MemoryAccess from "@core/memory/models/memoryAccess";
import MemoryMethodShape from "@core/memory/memoryMethodShape";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import { ProcessV2 } from "@core/processManager/processes/process";
import { errors } from "../errors";

class AllocateMemory implements ICommand {
  private readonly _memory = javascriptOs.get<MemoryMethodShape>(types.Memory);

  private _memoryKey: string;
  private _memoryAccess: Array<MemoryAccess>;

  constructor(args: { memoryKey: string; memoryAccess: Array<MemoryAccess> }) {
    this._memoryKey = args.memoryKey;
    this._memoryAccess = args.memoryAccess;
  }

  public Handle(Process: ProcessV2): number {
    if (!this._memoryAccess || !this._memoryKey) {
      return errors.ParameterError;
    }

    const result = this._memory.AllocateMemory(
      Process.pid,
      this._memoryKey,
      this._memoryAccess
    );

    if (result.code !== 0) {
      return -1;
    }

    return 0;
  }
}

export default AllocateMemory;
