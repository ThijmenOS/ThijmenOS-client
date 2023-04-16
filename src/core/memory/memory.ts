import { MemoryObject } from "./models/memoryObject";
import { injectable } from "inversify";
import MemoryMethodShape from "./memoryMethodShape";
import MemoryEntry from "./models/memoryEntry";
import MemoryAccess from "./models/memoryAccess";
import { ErrorExit } from "@providers/error/systemErrors/systemError";
import MemKeyAlreadyAllocated from "./errors/MemKeyAlreadyAllocated";
import MemAllocationDoesNotExist from "./errors/MemAllocationDoesNotExist";
import NoWriteAccessToMemAllocation from "./errors/NoWriteAccessToMemAllocation";
import NoReadAccessToMemAllocation from "./errors/NoReadAccessToMemAllocation";

//TODO: When memory is stored in localstorage, on startup all localstorage items to memory
@injectable()
class Memory implements MemoryMethodShape {
  private _memory: MemoryObject = {};

  public AllocateMemory(
    pid: string,
    memoryKey: string,
    memoryAccess: Array<MemoryAccess>
  ): ErrorExit | 0 {
    const memoryObject: MemoryEntry<any> = {
      ownerPid: pid,
      access: memoryAccess,
    };

    if (this._memory[memoryKey]) return new MemKeyAlreadyAllocated();

    this._memory[memoryKey] = memoryObject;
    return 0;
  }

  public SaveToMemory<T>(
    pid: string,
    key: string,
    data: T
  ): ErrorExit | number {
    const memoryEntry = this._memory[key];

    if (!memoryEntry) return new MemAllocationDoesNotExist();

    if (
      memoryEntry.ownerPid !== pid &&
      !this.ValidateMemoryAccess(memoryEntry.access, MemoryAccess.MEM_WRITE)
    )
      return new NoWriteAccessToMemAllocation();

    this._memory[key].data = data;

    return 0;
  }

  public LoadFromMemory<T>(pid: string, key: string): T | ErrorExit {
    const memoryEntry = this._memory[key];
    if (!memoryEntry) return new MemAllocationDoesNotExist();

    if (
      memoryEntry.ownerPid !== pid &&
      !this.ValidateMemoryAccess(memoryEntry.access, MemoryAccess.MEM_READ)
    )
      return new NoReadAccessToMemAllocation();

    return memoryEntry.data as T;
  }

  private ValidateMemoryAccess = (
    memoryAccess: Array<MemoryAccess>,
    validationTarget: MemoryAccess
  ): boolean => memoryAccess.includes(validationTarget);
}

export default Memory;
