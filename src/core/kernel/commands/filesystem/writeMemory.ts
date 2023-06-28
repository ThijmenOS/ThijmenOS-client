import MemoryMethodShape from "@core/memory/memoryMethodShape";
import { BaseProcess } from "@core/processManager/processes/baseProcess";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";

interface WriteMemoryArgs {
  memoryKey: string;
  data: object;
}
class WriteMemory implements ICommand {
  private readonly _memory = javascriptOs.get<MemoryMethodShape>(types.Memory);

  private _memoryKey: string;
  private _data: object;

  constructor(args: WriteMemoryArgs) {
    this._memoryKey = args.memoryKey;
    this._data = args.data;
  }

  public Handle(Process: BaseProcess): number | string {
    if (!this._memoryKey) {
      return 1;
    }

    const result = this._memory.SaveToMemory(
      Process.pid,
      this._memoryKey,
      this._data
    );

    if (result.code !== 0) return result.data;

    return 0;
  }
}

export default WriteMemory;
