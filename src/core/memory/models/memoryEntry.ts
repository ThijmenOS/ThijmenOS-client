import MemoryAccess from "./memoryAccess";

export default interface MemoryEntry<T> {
  ownerPid: string;
  access: Array<MemoryAccess>;
  data?: T;
}
