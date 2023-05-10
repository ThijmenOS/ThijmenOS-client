import MemoryAccess from "./models/memoryAccess";

export default interface MemoryMethodShape {
  AllocateMemory(
    pid: number,
    memoryKey: string,
    memoryAccess: Array<MemoryAccess>
  ): number;
  SaveToMemory<T extends object>(pid: number, key: string, data: T): number;
  LoadFromMemory<T>(pid: number, key: string): T | number;
}
