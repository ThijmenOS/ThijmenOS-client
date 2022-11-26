import { cacheObject } from "@ostypes/CacheTypes";
import { injectable } from "inversify";
import ICache from "./ICache";

@injectable()
class Cache implements ICache {
  cacheData: cacheObject = {};

  saveToCache<T>(key: string, object: T, localStorage = false): void {
    this.cacheData[key] = object;
  }

  loadFromCache<T>(key: string): T {
    return this.cacheData[key] as T;
  }
}

export default Cache;
