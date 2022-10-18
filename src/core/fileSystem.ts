import { IFileSystem } from "@interface/fileSystem/fileSystem";
import { directory } from "@interface/fileSystem/fileSystemTypes";
import { injectable } from "inversify";

@injectable()
class FileSystem implements IFileSystem {
  public async ShowFilesInDir(path = ""): Promise<Array<directory>> {
    return await $.get(
      `http://localhost:8080/filesystem/showUserFiles?dir=${path}`,
      (res) => res
    );
  }
  public async OpenFile(path: string): Promise<string> {
    return await $.get(
      `http://localhost:8080/filesystem/openUserFile?file=${path}`,
      (res) => res
    );
  }
}

export default FileSystem;
