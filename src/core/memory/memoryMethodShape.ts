import Exit from "@providers/error/systemErrors/Exit";
import MemoryAccess from "./models/memoryAccess";

export default interface MemoryMethodShape {
  AllocateMemory(
    pid: number,
    memoryKey: string,
    memoryAccess: Array<MemoryAccess>
  ): Exit;
  SaveToMemory<T extends object>(pid: number, key: string, data: T): Exit;
  LoadFromMemory<T>(pid: number, key: string): T | Exit;
}
