import { ApplicationMetaDataObject } from "@interface/application/applicationProperties";
import { IFileSystem } from "@interface/fileSystem/fileSystem";
import { directory } from "@interface/fileSystem/fileSystemTypes";
import { injectable } from "inversify";

@injectable()
class FileSystem implements IFileSystem {
  public async ShowFilesInDir(path = ""): Promise<Array<directory>> {
    return await $.get(
      `http://localhost:8080/filesystem/showUserFiles?dir=${path}`
    );
  }
  public async OpenFile(path: string): Promise<string> {
    return await $.get(
      `http://localhost:8080/filesystem/openUserFile?file=${path}`
    );
  }
  public async FetchInstalledApplications(): Promise<
    Array<ApplicationMetaDataObject>
  > {
    return await $.get(
      "http://localhost:8080/filesystem/readRegisteredApplications"
    );
  }
}

export default FileSystem;
