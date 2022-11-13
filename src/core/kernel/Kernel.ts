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
import {
  ShowFilesInDir,
  OpenFile,
  ChangeDirectory,
  MakeDirectory,
  RemoveDirectory,
  CreateFile,
} from "@thijmenos/filesystem";

//Types
import {
  KernelMethods,
  ValidMethods,
  JsOsCommunicationMessage,
  OpenFileType,
} from "@ostypes/KernelTypes";
import { Mkdir, Directory, Path } from "@thijmenos/common";
import { EventName, system } from "@ostypes/AppManagerTypes";

@injectable()
class Kernel implements IKernel {
  private readonly _core: ICore;
  private origin = "";

  constructor(@inject(types.Core) core: ICore) {
    this._core = core;
  }

  private kernelMethods: KernelMethods = {
    kernelMethodNotFound: () =>
      this._core.appManager.SendDataToApp<Error>(
        this.origin,
        //TODO: For development throw. But at the end, notify the application and log the incident
        new Error("The requested kernel method does not exist"),
        system,
        EventName.Error
      ),

    testCommand: (): void =>
      this._core.appManager.SendDataToApp<string>(
        this.origin,
        "test123",
        system,
        EventName.TestCommand
      ),

    //FileSystem
    filesInDir: (props: Path) =>
      ShowFilesInDir(props).then((res: Array<Directory>) =>
        this._core.appManager.SendDataToApp<Array<Directory>>(
          this.origin,
          res,
          system,
          EventName.SelfInvoked
        )
      ),

    readFile: (props: Path) =>
      OpenFile(props).then((res: string) =>
        this._core.appManager.SendDataToApp<string>(
          this.origin,
          res,
          system,
          EventName.SelfInvoked
        )
      ),

    changeDir: (props: Path) =>
      ChangeDirectory(props).then((res: string) =>
        this._core.appManager.SendDataToApp(
          this.origin,
          res,
          system,
          EventName.SelfInvoked
        )
      ),

    mkdir: (props: Mkdir) => {
      MakeDirectory(props).then((res: string) =>
        this._core.appManager.SendDataToApp<string>(
          this.origin,
          res,
          system,
          EventName.SelfInvoked
        )
      );
    },

    rmdir: (props: Path) => {
      RemoveDirectory(props).then((res: string) =>
        this._core.appManager.SendDataToApp<string>(
          this.origin,
          res,
          system,
          EventName.SelfInvoked
        )
      );
    },

    touch: (props: Mkdir) => {
      CreateFile(props).then((res: string) =>
        this._core.appManager.SendDataToApp<string>(
          this.origin,
          res,
          system,
          EventName.SelfInvoked
        )
      );
    },

    //Window operations
    closeSelf: () => this._core.appManager.CloseExecutable(this.origin),
    openFile: (props: OpenFileType) => this._core.appManager.OpenFile(props),

    //Settings
    changeBackground: (props: Path) =>
      this._core.settings.Background().Change(props),
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

  /*
    For every method there is a class.
    This class then knows the implementation of the method. This class has a property which knows if it has to send data back to the app
    if this property is true the class will set another property on itself with the data that has to go back to the app.
    The this processMethod will send the data on that property to the app.
  */
  private ProcessMethod(props: JsOsCommunicationMessage) {
    try {
      this.kernelMethods[props.method as ValidMethods](props.params);
    } catch (error) {
      this.kernelMethods.kernelMethodNotFound;
    }
  }
}

export default Kernel;
