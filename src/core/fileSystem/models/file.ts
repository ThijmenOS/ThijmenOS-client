import { GenerateId } from "@utils/generatePid";
import FileProperties from "../interfaces/file";
import { FileAccess, FileAccessOptions } from "../enums/fileAccess";

class File {
  public id: number;
  public userId: string;
  public access: FileAccess;
  public path: string;
  public locked: boolean;
  public mode?: FileAccessOptions;

  constructor(properties: FileProperties) {
    this.id = GenerateId();

    this.userId = properties.userId;
    this.access = properties.access;
    this.path = properties.path;
    this.mode = properties.mode;
    this.locked = false;
  }

  public get Locked(): boolean {
    return this.locked;
  }

  public Lock(): void {
    this.locked = true;
  }

  public Free(): void {
    this.locked = false;
  }
}

export default File;
