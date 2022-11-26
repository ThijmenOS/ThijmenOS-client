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

//Interfaces
import IKernel from "./IKernel";
import ICore from "@core/core/ICore";

//Types
import {
  KernelMethods,
  ValidMethods,
  JsOsCommunicationMessage,
} from "@ostypes/KernelTypes";
import Mediator from "./commands/Mediator";
import TouchCommand from "./commands/filesystem/TouchCommand";
import rmdirCommand from "./commands/filesystem/rmdirCommand";
import mkdirCommand from "./commands/filesystem/mkdirCommand";
import ChangeDirCommand from "./commands/filesystem/changeDirCommand";
import ReadFileCommand from "./commands/filesystem/readFileCommand";
import ShowFilesInDirCommand from "./commands/filesystem/showFilesInDirCommand";
import CloseSelfCommand from "./commands/application/closeSelfCommand";
import OpenFileCommand from "./commands/application/openFileCommand";
import ChangeBackgroundCommand from "./commands/settings/changeBackgroundCommand";
import { system } from "@ostypes/AppManagerTypes";
import { CommandReturn } from "@ostypes/CommandTypes";

@injectable()
class Kernel implements IKernel {
  private readonly _core: ICore;
  private origin = "";

  constructor(@inject(types.Core) core: ICore) {
    this._core = core;
  }

  private kernelMethods: KernelMethods = {
    // kernelMethodNotFound: () =>
    //   this._core.appManager.SendDataToApp<Error>(
    //     this.origin,
    //     //TODO: For development throw. But at the end, notify the application and log the incident
    //     new Error("The requested kernel method does not exist"),
    //     system,
    //     EventName.Error
    //   ),

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
    changeBackground: ChangeBackgroundCommand,
  };

  public ListenToCommunication(): void {
    window.onmessage = (event: MessageEvent) => {
      const messageData: JsOsCommunicationMessage = event.data;

      if (!this._core.appManager.CheckIfAppIsOpen(messageData.origin))
        throw new Error("Sender app is not known!");

      this.origin = messageData.origin;

      this.ProcessMethod(messageData);
    };
  }

  private async ProcessMethod(props: JsOsCommunicationMessage) {
    try {
      const command = this.kernelMethods[props.method as ValidMethods];

      const result = await Mediator.send(new command(props.params));

      if (result instanceof CommandReturn) {
        this._core.appManager.SendDataToApp(
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
