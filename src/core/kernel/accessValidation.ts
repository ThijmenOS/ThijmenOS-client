import MemoryMethodShape from "@core/memory/memoryMethodShape";
import javascriptOs from "@inversify/inversify.config";
import { AccessObjectMap } from "@ostypes/FileSystemTypes";
import { accesskey, userKey } from "@ostypes/memoryKeys";
import types from "@ostypes/types";
import { readAccessFile } from "@providers/filesystemEndpoints/root";
import { Access, AccessMap, Path, User } from "@thijmen-os/common";
import { injectable } from "inversify";
import AccessValidationMethods from "./accessValidationMethods";

@injectable()
class CommandAccessValidation implements AccessValidationMethods {
  private readonly _memory: MemoryMethodShape;
  //TODO: Find temp solution for access
  protected readonly tempDefaultAccess: AccessMap = {
    r: true,
    w: true,
    x: true,
  };

  constructor() {
    this._memory = javascriptOs.get<MemoryMethodShape>(types.Cache);
  }

  public async loadAccessFile(): Promise<void> {
    const accessMap = await readAccessFile();
    this._memory.saveToMemory<AccessObjectMap>(accesskey, accessMap);
  }

  protected validateAccess(object: Path, accesslevel: Access): boolean {
    const user = this.loadUserData();
    const accessData = this.loadAccessData();
    if (!accessData) return false;

    console.log(user);
    console.log(accessData);

    const targetObject = Object.keys(accessData).find((x) =>
      object.includes(x)
    );
    if (!targetObject) return true;

    const targetAccessObject = accessData[targetObject];

    const loggedInUserIsOwner = targetAccessObject.userId === user.userId;
    const operationIsAllowed = targetAccessObject.userAccess[accesslevel];

    if (loggedInUserIsOwner && operationIsAllowed) {
      return true;
    }

    return false;
  }

  protected loadUserData(): User {
    const user = this._memory.loadFromMemory<User>(userKey);
    //TODO: Throw kernel panic
    if (!user) {
      throw new Error();
    }

    return user;
  }

  private loadAccessData(): AccessObjectMap | false {
    const accessMap = this._memory.loadFromMemory<AccessObjectMap>(accesskey);

    //TODO: Implement invalid signature error
    if (!accessMap) return false;

    return accessMap;
  }
}

export default CommandAccessValidation;
