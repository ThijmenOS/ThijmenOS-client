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
import mkdirCommand from "./commands/filesystem/mkdir";
import ChangeDirCommand from "./commands/filesystem/cdCommand";
import ReadFileCommand from "./commands/filesystem/freadCommand";
import ListFilesCommand from "./commands/filesystem/lsCommand";
import OpenFileCommand from "./commands/application/openFileCommand";
import KernelMethodShape from "./kernelMethodShape";
// import AskPermissionCommand from "./commands/settings/askPermissionCommand";
// import RevokePermissionCommand from "./commands/settings/revokePermissionCommand";
// import RevokeAllPermissionCommand from "./commands/settings/revokeAllPermissionsCommand";
import StartProcess from "./commands/processes/startProcess";
import TerminateProcess from "./commands/processes/terminateProcess";
import AllocateMemory from "./commands/filesystem/memAllocCommand";
import ReadMemory from "./commands/filesystem/readMemory";
import WriteMemory from "./commands/filesystem/writeMemory";
import ExitProcess from "./commands/processes/exitProcess";
import WaitPid from "./commands/processes/waitpid";
import OpenMessageBus from "./commands/processes/openMessageBus";
import SendMsg from "./commands/processes/sendmsg";
import ReadMsg from "./commands/processes/readmsg";
import GetProcesses from "./commands/processes/getProcesses";
import Kill from "./commands/processes/kill";
import CloseMessageBus from "./commands/processes/closeMessageBus";
import ChangePassword from "./commands/users/changePassword";
import ChangeUserName from "./commands/users/changeName";
import GetCurrentUser from "./commands/users/usr";
import ValidateCredentials from "./commands/users/validateCredentials";
import RmCommand from "./commands/filesystem/rmCommand";
import WriteFileCommand from "./commands/filesystem/fwriteCommand";
import FFree from "./commands/filesystem/ffreeCommand";
import FLock from "./commands/filesystem/flockCommand";
import FOpen from "./commands/filesystem/fopenCommand";
import FileSystem from "@core/fileSystem/interfaces/fileSystem";
import { ICommand } from "@ostypes/CommandTypes";
import { BaseProcess } from "@core/processManager/processes/baseProcess";
import CreateWindow from "./commands/processes/createWindow";

@injectable()
class Kernel implements KernelMethodShape {
  private readonly _mediator: Mediator;
  private readonly _fileSystem: FileSystem;

  constructor(
    @inject(types.Mediator) mediator: Mediator,
    @inject(types.FileSystem)
    filesystem: FileSystem
  ) {
    this._mediator = mediator;
    this._fileSystem = filesystem;
  }

  public LoadKernel(): void {
    this._fileSystem.Initialise();
  }

  private readonly _kernelMethods: KernelMethods = {
    ls: ListFilesCommand,
    fread: ReadFileCommand,
    cd: ChangeDirCommand,
    mkdir: mkdirCommand,
    rm: RmCommand,
    touch: TouchCommand,
    memAlloc: AllocateMemory,
    memRead: ReadMemory,
    memWrite: WriteMemory,
    fwrite: WriteFileCommand,
    ffree: FFree,
    fopen: FOpen,
    flock: FLock,

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
    mqOpen: OpenMessageBus,
    sendMsg: SendMsg,
    readMsg: ReadMsg,
    killMq: CloseMessageBus,
    getProcesses: GetProcesses,
    kill: Kill,
    createWindow: CreateWindow,

    //User
    changePwd: ChangePassword,
    changeUsername: ChangeUserName,
    user: GetCurrentUser,
    auth: ValidateCredentials,
  };

  public async ProcessCommand(command: ICommand, process: BaseProcess) {
    try {
      const result = await this._mediator.Send(command, process);

      if (!process.code) {
        throw new Error();
      }

      return result;
    } catch (err) {
      return -1;
    }
  }

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
