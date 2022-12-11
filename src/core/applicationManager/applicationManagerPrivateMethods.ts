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
import ApplicationWindow from "@core/applicationWindow/applicationWindow";

//Types
import { ApplicationMetaData, Directory, MimeTypes } from "@thijmen-os/common";
import javascriptOs from "@inversify/inversify.config";
import IFileIcon from "@core/fileIcon/fileIconMethodShape";
import types from "@ostypes/types";

@injectable()
class AppManagerPrivateMethods {
  protected openApps: Array<ApplicationWindow> = new Array<ApplicationWindow>();
  protected installedApps: Array<ApplicationMetaData> =
    new Array<ApplicationMetaData>();

  protected FindInstalledAppsWithMimetype = (
    mimeType: MimeTypes
  ): Array<ApplicationMetaData> =>
    this.installedApps.filter((app) => app.mimeTypes.includes(mimeType));

  protected FindTargetApp = (target: string): ApplicationWindow => {
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

export default AppManagerPrivateMethods;
