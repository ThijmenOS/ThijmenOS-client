import { ErrorExit } from "@providers/error/systemErrors/systemError";
import MemoryAccess from "./models/memoryAccess";

export default interface MemoryMethodShape {
  AllocateMemory(
    pid: string,
    memoryKey: string,
    memoryAccess: Array<MemoryAccess>
  ): ErrorExit | number;
  SaveToMemory<T extends object>(
    pid: string,
    key: string,
    data: T
  ): ErrorExit | number;
  LoadFromMemory<T>(pid: string, key: string): T | ErrorExit;
}
