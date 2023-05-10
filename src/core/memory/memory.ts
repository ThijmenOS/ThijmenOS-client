import { MemoryObject } from "./models/memoryObject";
import { injectable } from "inversify";
import MemoryMethodShape from "./memoryMethodShape";
import MemoryEntry from "./models/memoryEntry";
import MemoryAccess from "./models/memoryAccess";
import { errors, success } from "@core/kernel/commands/errors";

//TODO: When memory is stored in localstorage, on startup all localstorage items to memory
@injectable()
class Memory implements MemoryMethodShape {
  private _memory: MemoryObject = {};

  public AllocateMemory(
    pid: number,
    memoryKey: string,
    memoryAccess: Array<MemoryAccess>
  ): number {
    const memoryObject: MemoryEntry<any> = {
      ownerPid: pid,
      access: memoryAccess,
    };

    if (this._memory[memoryKey]) return errors.MemoryAlreadyAllocated;

    this._memory[memoryKey] = memoryObject;
    return success;
  }

  public SaveToMemory<T>(pid: number, key: string, data: T): number {
    const memoryEntry = this._memory[key];

    if (!memoryEntry) return errors.MemoryAllocationDoesNotExist;

    if (
      memoryEntry.ownerPid !== pid &&
      !this.ValidateMemoryAccess(memoryEntry.access, MemoryAccess.MEM_WRITE)
    )
      return errors.NoWriteAccessToMemoryAddress;

    this._memory[key].data = data;

    return success;
  }

  public LoadFromMemory<T>(pid: number, key: string): T | number {
    const memoryEntry = this._memory[key];
    if (!memoryEntry) return errors.MemoryAllocationDoesNotExist;

    if (
      memoryEntry.ownerPid !== pid &&
      !this.ValidateMemoryAccess(memoryEntry.access, MemoryAccess.MEM_READ)
    )
      return errors.NoReadAccessToMemoryAddress;

    return memoryEntry.data as T;
  }

  private ValidateMemoryAccess = (
    memoryAccess: Array<MemoryAccess>,
    validationTarget: MemoryAccess
  ): boolean => memoryAccess.includes(validationTarget);
}

export default Memory;
