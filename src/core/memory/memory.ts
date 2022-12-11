import { cacheObject } from "@ostypes/CacheTypes";
import { injectable } from "inversify";
import MemoryMethodShape from "./memoryMethodShape";

@injectable()
class Memory implements MemoryMethodShape {
  cacheData: cacheObject = {};

  saveToMemory<T>(key: string, object: T): void {
    this.cacheData[key] = object;
  }

  loadFromMemory<T>(key: string): T {
    return this.cacheData[key] as T;
  }
}

export default Memory;
