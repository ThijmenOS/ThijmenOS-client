import MemoryAccess from "./memoryAccess";

export default interface MemoryEntry<T> {
  ownerPid: number;
  access: Array<MemoryAccess>;
  data?: T;
}
