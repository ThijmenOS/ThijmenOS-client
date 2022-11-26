/* <Class Documentation>

  <Class Description>
    AppManagerUtls is a set of utility methods that are used by AppManager.ts

  <Method Description>
    FindInstalledAppsWithMimetype(): This method finds applications that support a given mimetype.
    FindTargetApp(): When the AppManager needs to do some operations on an application it gets the application hash. With this has the FindTargetApp method will try to find the mathing application meta data

*/

//DI
import { injectable } from "inversify";

//Classes
import { Window } from "@thijmen-os/window";

//Types
import { ApplicationMetaData, Directory, MimeTypes } from "@thijmen-os/common";
import javascriptOs from "@inversify/inversify.config";
import IFileIcon from "@core/fileIcon/IFileIcon";
import types from "@ostypes/types";

@injectable()
class AppManagerUtils {
  protected openApps: Array<Window> = new Array<Window>();
  protected installedApps: Array<ApplicationMetaData> =
    new Array<ApplicationMetaData>();

  protected FindInstalledAppsWithMimetype = (
    mimeType: MimeTypes
  ): Array<ApplicationMetaData> =>
    this.installedApps.filter((app) => app.mimeTypes.includes(mimeType));

  protected FindTargetApp = (target: string): Window => {
    const targetApp = this.openApps.find(
      (app) => app.windowOptions.windowIdentifier === target
    );

    if (!targetApp) {
      throw new Error("the app could not be found!");
    }

    return targetApp;
  };
  protected RenderIcon(content: Array<Directory>) {
    content.forEach((file) =>
      javascriptOs
        .get<IFileIcon>(types.FileIcon)
        .ConstructFileIcon(file.filePath)
    );
  }
}

export default AppManagerUtils;
