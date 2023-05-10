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
import KernelMethodShape from "./kernelMethodShape";
// import AskPermissionCommand from "./commands/settings/askPermissionCommand";
// import RevokePermissionCommand from "./commands/settings/revokePermissionCommand";
// import RevokeAllPermissionCommand from "./commands/settings/revokeAllPermissionsCommand";
import AccessValidationMethods from "./accessValidationMethods";
import StartProcess from "./commands/processes/startProcess";
import TerminateProcess from "./commands/processes/terminateProcess";
import AllocateMemory from "./commands/filesystem/allocateMemory";
import ReadMemory from "./commands/filesystem/readMemory";
import WriteMemory from "./commands/filesystem/writeMemory";
import SelectFile from "./commands/application/selectFile";
import ExitProcess from "./commands/processes/exit";
import WaitPid from "./commands/processes/waitpid";
import CreateMessageBus from "./commands/processes/createMessageBus";

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

  public LoadKernel(): void {
    this._commandAccessValidator.LoadAccessFile();
  }

  private readonly _kernelMethods: KernelMethods = {
    listFiles: ListFilesCommand,
    readFile: ReadFileCommand,
    changeDir: ChangeDirCommand,
    mkdir: mkdirCommand,
    rmdir: rmdirCommand,
    touch: TouchCommand,
    memAlloc: AllocateMemory,
    memRead: ReadMemory,
    memWrite: WriteMemory,
    selectFile: SelectFile,

    //Window operations
    openFile: OpenFileCommand,

    //Settings
    // askPermission: AskPermissionCommand,
    // revokeAllPermissions: RevokeAllPermissionCommand,
    // revokePermission: RevokePermissionCommand,

    startProcess: StartProcess,
    terminateProcess: TerminateProcess,
    exit: ExitProcess,
    waitpid: WaitPid,
    crtmsgbus: CreateMessageBus,
  };

  public async ProcessMethod(props: JsOsCommunicationMessage) {
    try {
      const command = this._kernelMethods[props.method as ValidMethods];

      const result = await this._mediator.Send(
        new command(props.params),
        props.origin
      );

      if (!props.origin.code) {
        throw new Error();
      }

      props.origin.code.Message({
        data: result,
        id: props.messageId,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default Kernel;
