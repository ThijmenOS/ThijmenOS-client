import Exit from "@providers/error/systemErrors/Exit";
import MemoryAccess from "./models/memoryAccess";

export default interface MemoryMethodShape {
  AllocateMemory(
    pid: string,
    memoryKey: string,
    memoryAccess: Array<MemoryAccess>
  ): Exit;
  SaveToMemory<T extends object>(pid: string, key: string, data: T): Exit;
  LoadFromMemory<T>(pid: string, key: string): T | Exit;
}
