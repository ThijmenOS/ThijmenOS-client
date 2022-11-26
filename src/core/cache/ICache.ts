export default interface ICache {
  saveToCache<T extends object>(
    key: string,
    object: T,
    localStorage?: boolean
  ): void;
  loadFromCache<T>(key: string): T;
}
