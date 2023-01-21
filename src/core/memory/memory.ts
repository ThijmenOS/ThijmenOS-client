import { cacheObject } from "@ostypes/CacheTypes";
import { injectable } from "inversify";
import MemoryMethodShape from "./memoryMethodShape";

@injectable()
class Memory implements MemoryMethodShape {
  cacheData: cacheObject = {};

  saveToMemory<T>(key: string, object: T, localstorage?: boolean): void {
    this.cacheData[key] = object;

    if (localstorage) {
      localStorage.setItem(key, JSON.stringify(object));
    }
  }

  loadFromMemory<T>(key: string): T | undefined {
    const localCache = this.cacheData[key];

    if (localCache) {
      return localCache as T;
    }

    const localstorage = localStorage.getItem(key);

    if (localstorage) {
      return JSON.parse(localstorage) as T;
    }

    return undefined;
  }
}

export default Memory;
