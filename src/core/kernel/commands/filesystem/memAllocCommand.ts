import MemoryAccess from "@core/memory/models/memoryAccess";
import MemoryMethodShape from "@core/memory/memoryMethodShape";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import { ProcessV2 } from "@core/processManager/processes/process";

interface AllocateMemoryArgs {
  memoryKey: string;
  memoryAccess: Array<MemoryAccess>;
}

class AllocateMemory implements ICommand {
  private readonly _memory = javascriptOs.get<MemoryMethodShape>(types.Memory);

  private _memoryKey: string;
  private _memoryAccess: Array<MemoryAccess>;

  constructor(args: AllocateMemoryArgs) {
    this._memoryKey = args.memoryKey;
    this._memoryAccess = args.memoryAccess;
  }

  public Handle(Process: ProcessV2): number | string {
    if (!this._memoryAccess || !this._memoryKey) {
      return -1;
    }

    const result = this._memory.AllocateMemory(
      Process.pid,
      this._memoryKey,
      this._memoryAccess
    );

    if (result.code !== 0) {
      return result.data;
    }

    Process.AddResource.memoryAllocation(this._memoryKey);

    return 0;
  }
}

export default AllocateMemory;
