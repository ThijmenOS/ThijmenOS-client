/* <Class Documentation>

  <Class Description>
    This class provides methods that perform different actions on the backend api

*/

//DI
import { injectable } from "inversify";

//Interfaces
import IFileSystem from "./IFileSystem";

//Types
import { ApplicationMetaDataObject } from "@ostypes/ApplicationTypes";
import { OSSettings } from "@ostypes/SettingsTypes";
import { Mkdir } from "@common/FileSystem";
import { Directory, Path } from "@common/FileSystem";
import { config } from "@config/javascriptOsConfig";

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
  public async MakeDirectory(props: Mkdir): Promise<string> {
    return await $.post(config.host + "/filesystem/makeDirectory", props);
  }
  public async CreateFile(props: string): Promise<string> {
    return await $.post(config.host + "/filesystem/makeFIle", props);
  }
  public async RemoveDirectory(props: Path): Promise<string> {
    return await $.post(config.host + "/filesystem/removeDirectory", {
      Path: props,
    });
  }
}

export default FileSystem;
