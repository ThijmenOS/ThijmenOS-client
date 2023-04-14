export default interface MemoryMethodShape {
  SaveToMemory<T extends object>(
    key: string,
    object: T,
    localStorage?: boolean
  ): void;
  LoadFromMemory<T>(key: string): T | undefined;
}
