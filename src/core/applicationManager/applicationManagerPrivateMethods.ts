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

//Types
import { ApplicationMetaData, Directory, MimeTypes } from "@thijmen-os/common";
import javascriptOs from "@inversify/inversify.config";
import IFileIcon from "@core/fileIcon/fileIconMethodShape";
import types from "@ostypes/types";
import { ApplicationInstance } from "@ostypes/AppManagerTypes";

@injectable()
class AppManagerPrivateMethods {
  protected openApps: Array<ApplicationInstance> =
    new Array<ApplicationInstance>();
  protected installedApps: Array<ApplicationMetaData> =
    new Array<ApplicationMetaData>();

  protected FindInstalledAppsWithMimetype = (
    mimeType: MimeTypes
  ): Array<ApplicationMetaData> =>
    this.installedApps.filter((app) => app.mimeTypes.includes(mimeType));

  protected RenderIcon(content: Array<Directory>) {
    content.forEach((file) =>
      javascriptOs
        .get<IFileIcon>(types.FileIcon)
        .ConstructFileIcon(file.filePath)
    );
  }
}

export default AppManagerPrivateMethods;
