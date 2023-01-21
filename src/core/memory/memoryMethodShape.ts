export default interface MemoryMethodShape {
  saveToMemory<T extends object>(
    key: string,
    object: T,
    localStorage?: boolean
  ): void;
  loadFromMemory<T>(key: string): T | undefined;
}
