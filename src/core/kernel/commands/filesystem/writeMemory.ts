import MemoryMethodShape from "@core/memory/memoryMethodShape";
import { BaseProcess } from "@core/processManager/processes/baseProcess";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import { errors } from "../errors";

class WriteMemory implements ICommand {
  private readonly _memory = javascriptOs.get<MemoryMethodShape>(types.Memory);

  private _memoryKey: string;
  private _data: object;

  constructor(args: { memoryKey: string; data: object }) {
    this._memoryKey = args.memoryKey;
    this._data = args.data;
  }

  public Handle(Process: BaseProcess): number {
    if (!this._memoryKey) {
      return errors.ParameterError;
    }

    const result = this._memory.SaveToMemory(
      Process.pid,
      this._memoryKey,
      this._data
    );

    return result;
  }
}

export default WriteMemory;
