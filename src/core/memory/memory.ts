import { MemoryObject } from "./models/memoryObject";
import { injectable } from "inversify";
import MemoryMethodShape from "./memoryMethodShape";
import MemoryEntry from "./models/memoryEntry";
import MemoryAccess from "./models/memoryAccess";
import MemAllocNotFound from "./errors/memAllocNotFound";
import Exit from "@providers/error/systemErrors/Exit";
import NoMemReadAccess from "./errors/noMemReadAccess";
import MemoryAlreadyAllocated from "./errors/memAlreadyAllocated";
import NoMemWWriteAccess from "./errors/noMemWriteAccess";

@injectable()
class Memory implements MemoryMethodShape {
  private _memory: MemoryObject = {};

  public AllocateMemory(
    pid: number,
    memoryKey: string,
    memoryAccess: Array<MemoryAccess>
  ): Exit {
    const memoryObject: MemoryEntry<unknown> = {
      ownerPid: pid,
      access: memoryAccess,
    };

    if (this._memory[memoryKey]) {
      return new MemoryAlreadyAllocated();
    }

    this._memory[memoryKey] = memoryObject;
    return new Exit();
  }

  public DeAllocateMemory(memoryKey: string): Exit<string> {
    delete this._memory[memoryKey];

    return new Exit();
  }

  public SaveToMemory<T>(pid: number, key: string, data: T): Exit {
    const memoryEntry = this._memory[key];

    if (!memoryEntry) return new MemAllocNotFound();

    if (
      memoryEntry.ownerPid !== pid &&
      !this.ValidateMemoryAccess(memoryEntry.access, MemoryAccess.MEM_WRITE)
    )
      return new NoMemWWriteAccess();

    this._memory[key].data = data;

    return new Exit();
  }

  public LoadFromMemory<T>(pid: number, key: string): T | Exit {
    const memoryEntry = this._memory[key];
    if (!memoryEntry) {
      return new MemAllocNotFound();
    }

    if (
      memoryEntry.ownerPid !== pid &&
      !this.ValidateMemoryAccess(memoryEntry.access, MemoryAccess.MEM_READ)
    ) {
      return new NoMemReadAccess();
    }

    return memoryEntry.data as T;
  }

  public MemoryDump(): MemoryObject {
    return this._memory;
  }

  private ValidateMemoryAccess = (
    memoryAccess: Array<MemoryAccess>,
    validationTarget: MemoryAccess
  ): boolean => memoryAccess.includes(validationTarget);
}

export default Memory;
