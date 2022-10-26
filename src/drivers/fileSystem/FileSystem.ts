import { ApplicationMetaDataObject } from "@ostypes/ApplicationTypes";
import IFileSystem from "./IFileSystem";
import { Directory } from "@ostypes/FileSystemTypes";
import { injectable } from "inversify";
import { config } from "@config/javascriptOsConfig";
import { OSSettings } from "@ostypes/SettingsTypes";
import { Path } from "@ostypes/KernelTypes";

@injectable()
class FileSystem implements IFileSystem {
  public async ShowFilesInDir(path = ""): Promise<Array<Directory>> {
    return await $.get(`${config.host}/filesystem/showUserFiles?dir=${path}`);
  }
  public async OpenFile(path: string): Promise<string> {
    return await $.get(`${config.host}/filesystem/openUserFile?file=${path}`);
  }
  public async FetchInstalledApplications(): Promise<
    Array<ApplicationMetaDataObject>
  > {
    return await $.get(`${config.host}/root/readRegisteredApplications`);
  }
  public async FetchSettings(): Promise<OSSettings> {
    return await $.get(config.host + "/root/readSettings");
  }
  public async ChangeDirectory(path: Path): Promise<string> {
    return await $.get(config.host + `/root/changeDirectory?path=${path}`);
  }
}

export default FileSystem;
