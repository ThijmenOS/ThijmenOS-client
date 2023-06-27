import { inject, injectable } from "inversify";
import FileSystemMethods from "./interfaces/fileSystem";
import File from "@core/fileSystem/models/file";
import { Open } from "@providers/filesystemEndpoints/filesystem";
import { FileAccess } from "./enums/fileAccess";
import { Access, Exit, User } from "@thijmen-os/common";
import FatalError from "@providers/error/userErrors/fatalError";
import { OSErrors } from "@providers/error/defaults/errors";
import MemoryMethodShape from "@core/memory/memoryMethodShape";
import types from "@ostypes/types";
import { GenerateId } from "@utils/generatePid";
import { userKey } from "@ostypes/memoryKeys";
import { FileAccessOptions } from "./enums/fileAccess";

@injectable()
class FileSystem implements FileSystemMethods {
  private readonly _memory: MemoryMethodShape;
  private readonly _pid: number;

  private _knownFiles: { [key in string]: File };

  constructor(@inject(types.Memory) memory: MemoryMethodShape) {
    this._memory = memory;
    this._pid = GenerateId();

    this._knownFiles = {};
  }

  public async Initialise(): Promise<void> {
    const rawFilesObject = await Open(
      "C/OperatingSystem/ThijmenOsData/.access"
    );

    if (!rawFilesObject) {
      throw new FatalError("Could not index files", OSErrors.couldNotLoadFiles);
    }

    this._knownFiles = this.ParseFiles(rawFilesObject);
  }

  private ParseFiles(rawObject: string) {
    const filesObject: { [key in string]: File } = {};

    rawObject.split(/\r?\n/).map((accessLine) => {
      const accessAttributes = accessLine.split(":");
      let path = accessAttributes.shift();
      if (!path) path = "####";

      const userAccessAttributes = accessAttributes[0].split("");
      let userId = userAccessAttributes.shift();
      if (!userId) userId = "####";

      const userAccess: FileAccess = {
        r: false,
        w: false,
        x: false,
      };
      userAccessAttributes.forEach((access) => {
        userAccess[access as Access] = access !== "-" && true;
      });

      filesObject[path] = new File({
        access: userAccess,
        path: path,
        userId: userId,
      });
    });

    return filesObject;
  }

  private LoadUserData(): User {
    const result = this._memory.LoadFromMemory<User>(this._pid, userKey);
    //TODO: Throw kernel panic
    if (result instanceof Exit) {
      throw new Error(result.data);
    }

    return result as User;
  }

  public ValidateAccess<T extends boolean>(
    path: string,
    operation: FileAccessOptions,
    fd = true
  ): File | T {
    const user = this.LoadUserData();

    const targetPath = Object.keys(this._knownFiles).find((x) =>
      x.includes(path)
    );

    if (!fd) {
      return true as T;
    }

    if (!targetPath) return false as T;

    const targetFile = this._knownFiles[targetPath];

    const locked = targetFile.Locked;
    const loggedInUserIsOwner = targetFile.userId === user.userId;
    const operationIsAllowed = targetFile.access[operation];

    if (loggedInUserIsOwner && operationIsAllowed && !locked) {
      return targetFile;
    }

    return false as T;
  }

  public RegisterFile(
    path: string,
    userId: string,
    accessMap: FileAccess
  ): File | null {
    const fileHandler = new File({
      access: accessMap,
      path: path,
      userId: userId,
    });

    this._knownFiles[path] = fileHandler;

    return fileHandler;
  }
}

export default FileSystem;
