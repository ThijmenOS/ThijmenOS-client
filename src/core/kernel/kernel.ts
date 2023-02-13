/* <Class Documentation>

  <Class Description>
    The kernel class is the heart of communication between apps and OS. An app can send method requests to the os which all come in here. These requests can for example be to get some information or to open an file.

  <Method Description>
    kernelMethods: This is an object that contains implementations for every possible kernel method
      |_ There is an enum with names of kernel methods. These are the existing kernel methods. This object has properties with impementations of all of these enum values. If it then has to send some data back to the application it will call the SendDataToApp method that lives within the AppManager class
      
    ListenToCommunication(): This method listens to incomming requests from apps. It will validate the nesecery things and extracts the needed that from the request. Then it will pass it on to the handler to perform the request that was maade
    ProcessMethod(): This method will call the implementation of the method that was requested by the app

*/

//DI
import { inject, injectable } from "inversify";
import types from "@ostypes/types";

//Types
import {
  KernelMethods,
  ValidMethods,
  JsOsCommunicationMessage,
} from "@core/kernel/kernelTypes";
import Mediator from "./commands/Mediator";
import TouchCommand from "./commands/filesystem/touchCommand";
import rmdirCommand from "./commands/filesystem/rmdirCommand";
import mkdirCommand from "./commands/filesystem/mkdirCommand";
import ChangeDirCommand from "./commands/filesystem/changeDirCommand";
import ReadFileCommand from "./commands/filesystem/readFileCommand";
import ShowFilesInDirCommand from "./commands/filesystem/showFilesInDirCommand";
import CloseSelfCommand from "./commands/application/closeSelfCommand";
import OpenFileCommand from "./commands/application/openFileCommand";
import { system } from "@ostypes/AppManagerTypes";
import { CommandReturn } from "@ostypes/CommandTypes";
import KernelMethodShape from "./kernelMethodShape";
import ApplicationManager from "@core/applicationManager/applicationManagerMethodShape";
import AskPermissionCommand from "./commands/settings/askPermissionCommand";
import RevokePermissionCommand from "./commands/settings/revokePermissionCommand";
import RevokeAllPermissionCommand from "./commands/settings/revokeAllPermissionsCommand";
import AccessValidationMethods from "./accessValidationMethods";

@injectable()
class Kernel implements KernelMethodShape {
  private readonly _applicationManager: ApplicationManager;
  private readonly _mediator: Mediator;
  private readonly _commandAccessValidator: AccessValidationMethods;
  private origin = "";

  constructor(
    @inject(types.AppManager) applicationManager: ApplicationManager,
    @inject(types.Mediator) mediator: Mediator,
    @inject(types.CommandAccessValidation)
    accessValidator: AccessValidationMethods
  ) {
    this._applicationManager = applicationManager;
    this._mediator = mediator;
    this._commandAccessValidator = accessValidator;
  }

  public loadKernel(): void {
    this._commandAccessValidator.loadAccessFile();
  }

  private kernelMethods: KernelMethods = {
    filesInDir: ShowFilesInDirCommand,

    readFile: ReadFileCommand,

    changeDir: ChangeDirCommand,

    mkdir: mkdirCommand,

    rmdir: rmdirCommand,

    touch: TouchCommand,

    //Window operations
    closeSelf: CloseSelfCommand,
    openFile: OpenFileCommand,

    //Settings
    askPermission: AskPermissionCommand,
    revokeAllPermissions: RevokeAllPermissionCommand,
    revokePermission: RevokePermissionCommand,
  };

  public ListenToCommunication(): void {
    window.onmessage = (event: MessageEvent) => {
      const messageData: JsOsCommunicationMessage = event.data;

      if (!this._applicationManager.CheckIfAppIsOpen(messageData.origin))
        throw new Error("Sender app is not known!");

      this.origin = messageData.origin;

      this.ProcessMethod(messageData);
    };
  }

  //TODO: better way enforce rules
  private async ProcessMethod(props: JsOsCommunicationMessage) {
    try {
      const applicationId =
        this._applicationManager.FindCorrespondingAppWithWindowHash(
          props.origin
        );

      const command = this.kernelMethods[props.method as ValidMethods];

      const result = await this._mediator.send(
        new command(props.params),
        applicationId
      );

      if (result instanceof CommandReturn) {
        this._applicationManager.SendDataToApp(
          this.origin,
          result.data,
          system,
          result.event
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default Kernel;
