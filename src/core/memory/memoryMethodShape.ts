export default interface MemoryMethodShape {
  AllocateMemory(pid: Array<string>): boolean;
  SaveToMemory<T extends object>(
    key: string,
    object: T,
    localStorage?: boolean
  ): void;
  LoadFromMemory<T>(key: string): T | null;
}
