import MemoryAccess from "@core/memory/models/memoryAccess";
import MemoryMethodShape from "@core/memory/memoryMethodShape";
import { Process } from "@core/processManager/interfaces/baseProcess";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import { ErrorExit } from "@providers/error/systemErrors/systemError";
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

  public Handle(Process: Process): ErrorExit | void {
    if (!this._memoryAccess || !this._memoryKey) {
      return new ParameterError("AllocMem");
    }

    const allocated = this._memory.AllocateMemory(
      Process.processIdentifier,
      this._memoryKey,
      this._memoryAccess
    );

    if (allocated instanceof ErrorExit) {
      return allocated;
    }

    return undefined;
  }
}

export default AllocateMemory;
