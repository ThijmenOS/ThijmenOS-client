import MemoryMethodShape from "@core/memory/memoryMethodShape";
import javascriptOs from "@inversify/inversify.config";
import { AccessObjectMap } from "@ostypes/FileSystemTypes";
import { rootkey, userKey } from "@ostypes/memoryKeys";
import types from "@ostypes/types";
import NoPermission from "@providers/error/userErrors/NoPermission";
import { readAccessFile } from "@providers/filesystemEndpoints/root";
import { Access, AccessMap, Path, User } from "@thijmen-os/common";
import { injectable } from "inversify";
import AccessValidationMethods from "./accessValidationMethods";
import { GenerateId } from "@utils/generatePid";
import Exit from "@providers/error/systemErrors/Exit";

@injectable()
class CommandAccessValidation implements AccessValidationMethods {
  private readonly _memory: MemoryMethodShape;
  //TODO: Find temp solution for access
  public readonly tempDefaultAccess: AccessMap = {
    r: true,
    w: true,
    x: true,
  };

  private readonly _pid: number = GenerateId();

  constructor() {
    this._memory = javascriptOs.get<MemoryMethodShape>(types.Memory);

    this._memory.AllocateMemory(this._pid, rootkey, []);
  }

  public get UserId(): string {
    return this.LoadUserData().userId;
  }

  public async LoadAccessFile(): Promise<void> {
    const accessMap = await readAccessFile();
    this._memory.SaveToMemory<AccessObjectMap>(this._pid, rootkey, accessMap);
  }

  public ValidateAccess(object: Path, accesslevel: Access): boolean {
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

  private LoadUserData(): User {
    const result = this._memory.LoadFromMemory<User>(this._pid, userKey);
    //TODO: Throw kernel panic
    if (result instanceof Exit) {
      throw new Error(result.data);
    }

    return result;
  }

  private LoadAccessData(): AccessObjectMap {
    const result = this._memory.LoadFromMemory<AccessObjectMap>(
      this._pid,
      rootkey
    );

    //TODO: Implement invalid signature error
    if (result instanceof Exit) {
      throw new Error(result.data);
    }

    return result;
  }
}

export default CommandAccessValidation;
