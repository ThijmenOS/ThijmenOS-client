import MemoryMethodShape from "@core/memory/memoryMethodShape";
import javascriptOs from "@inversify/inversify.config";
import { AccessObjectMap } from "@ostypes/FileSystemTypes";
import { accesskey, userKey } from "@ostypes/memoryKeys";
import types from "@ostypes/types";
import NoPermission from "@providers/error/errors/NoPermission";
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
    this._memory = javascriptOs.get<MemoryMethodShape>(types.Memory);
  }

  public async LoadAccessFile(): Promise<void> {
    const accessMap = await readAccessFile();
    this._memory.SaveToMemory<AccessObjectMap>(accesskey, accessMap);
  }

  protected ValidateAccess(object: Path, accesslevel: Access): boolean {
    const user = this.LoadUserData();
    const accessData = this.LoadAccessData();
    if (!accessData) return false;

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

    throw new NoPermission("Resource access denied");
  }

  protected LoadUserData(): User {
    const user = this._memory.LoadFromMemory<User>(userKey);
    //TODO: Throw kernel panic
    if (!user) {
      throw new Error();
    }

    return user;
  }

  private LoadAccessData(): AccessObjectMap | false {
    const accessMap = this._memory.LoadFromMemory<AccessObjectMap>(accesskey);

    //TODO: Implement invalid signature error
    if (!accessMap) return false;

    return accessMap;
  }
}

export default CommandAccessValidation;
