import { memoryObject } from "@ostypes/CacheTypes";
import { injectable } from "inversify";
import MemoryMethodShape from "./memoryMethodShape";

@injectable()
class Memory implements MemoryMethodShape {
  private memory: memoryObject = {};

  public AllocateMemory(pid: Array<string>): boolean {
    const memoryKey = this.GenerateProcessKey(pid);

    if (this.memory[memoryKey]) return false;

    this.memory[memoryKey] = {};
    return true;
  }

  public SaveToMemory<T>(key: string, object: T, localstorage?: boolean): void {
    this.memory[key] = object;

    if (localstorage) {
      localStorage.setItem(key, JSON.stringify(object));
    }
  }

  public LoadFromMemory<T>(key: string): T | null {
    const localCache = this.memory[key];

    if (localCache) {
      return localCache as T;
    }

    const localstorage = localStorage.getItem(key);

    if (localstorage) {
      return JSON.parse(localstorage) as T;
    }

    return null;
  }

  private GenerateProcessKey = (pid: Array<string>): string =>
    pid
      .map((id) => {
        const fist = id.substring(0, 5);
        fist.concat(id.substring(id.length - 5, id.length));
      })
      .join();
}

export default Memory;
