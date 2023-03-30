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
  JsOsCommunicationMessage,
} from "@core/kernel/kernelTypes";
import { ValidMethods } from "./kernelMethods";
import Mediator from "./commands/Mediator";
import TouchCommand from "./commands/filesystem/touchCommand";
import rmdirCommand from "./commands/filesystem/rmdirCommand";
import mkdirCommand from "./commands/filesystem/mkdirCommand";
import ChangeDirCommand from "./commands/filesystem/changeDirCommand";
import ReadFileCommand from "./commands/filesystem/readFileCommand";
import ListFilesCommand from "./commands/filesystem/listFilesCommand";
import OpenFileCommand from "./commands/application/openFileCommand";
import { CommandReturn } from "@ostypes/CommandTypes";
import KernelMethodShape from "./kernelMethodShape";
import AskPermissionCommand from "./commands/settings/askPermissionCommand";
import RevokePermissionCommand from "./commands/settings/revokePermissionCommand";
import RevokeAllPermissionCommand from "./commands/settings/revokeAllPermissionsCommand";
import AccessValidationMethods from "./accessValidationMethods";
import Communication from "./commands/application/communication";
import StartProcess from "./commands/processes/startProcess";
import TerminateProcess from "./commands/processes/terminateProcess";
import SpawnWindow from "./commands/processes/spawnWindow";

@injectable()
class Kernel implements KernelMethodShape {
  private readonly _mediator: Mediator;
  private readonly _commandAccessValidator: AccessValidationMethods;

  constructor(
    @inject(types.Mediator) mediator: Mediator,
    @inject(types.CommandAccessValidation)
    accessValidator: AccessValidationMethods
  ) {
    this._mediator = mediator;
    this._commandAccessValidator = accessValidator;
  }

  public loadKernel(): void {
    this._commandAccessValidator.loadAccessFile();
  }

  private kernelMethods: KernelMethods = {
    listFiles: ListFilesCommand,

    readFile: ReadFileCommand,

    changeDir: ChangeDirCommand,

    mkdir: mkdirCommand,

    rmdir: rmdirCommand,

    touch: TouchCommand,

    //Window operations
    openFile: OpenFileCommand,

    //Settings
    askPermission: AskPermissionCommand,
    revokeAllPermissions: RevokeAllPermissionCommand,
    revokePermission: RevokePermissionCommand,

    startProcess: StartProcess,
    terminateProcess: TerminateProcess,
    spawnWindow: SpawnWindow,
  };

  public async ProcessMethod(props: JsOsCommunicationMessage) {
    try {
      const command = this.kernelMethods[props.method as ValidMethods];

      const result = await this._mediator.send(
        new command(props.params),
        props.processIdentifier
      );

      if (result instanceof CommandReturn) {
        new Communication({
          data: result.data,
          eventName: result.event,
          worker: props.origin,
        }).Handle();
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default Kernel;
