import { cacheObject } from "@ostypes/CacheTypes";
import { injectable } from "inversify";
import MemoryMethodShape from "./memoryMethodShape";

@injectable()
class Memory implements MemoryMethodShape {
  private memory: cacheObject = {};

  public saveToMemory<T>(key: string, object: T, localstorage?: boolean): void {
    this.memory[key] = object;

    if (localstorage) {
      localStorage.setItem(key, JSON.stringify(object));
    }
  }

  public loadFromMemory<T>(key: string): T | undefined {
    const localCache = this.memory[key];

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
