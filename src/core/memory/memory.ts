import { CacheObject } from "@ostypes/CacheTypes";
import { injectable } from "inversify";
import MemoryMethodShape from "./memoryMethodShape";

@injectable()
class Memory implements MemoryMethodShape {
  private _memory: CacheObject = {};

  public SaveToMemory<T>(key: string, object: T, localstorage?: boolean): void {
    this._memory[key] = object;

    if (localstorage) {
      localStorage.setItem(key, JSON.stringify(object));
    }
  }

  public LoadFromMemory<T>(key: string): T | undefined {
    const localCache = this._memory[key];

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
