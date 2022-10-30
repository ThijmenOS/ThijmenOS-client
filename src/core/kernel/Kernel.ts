import {
  KernelMethods,
  ValidMethods,
  JsOsCommunicationMessage,
  OpenFile,
} from "@ostypes/KernelTypes";
import { inject, injectable } from "inversify";
import IKernel from "./IKernel";
import types from "@ostypes/types";
import IAppManager from "@core/appManager/IAppManager";
import ICore from "@core/core/ICore";
import { Mkdir, Directory, Path } from "@common/FileSystem";
import { EventName, system } from "@ostypes/AppManagerTypes";

@injectable()
class Kernel implements IKernel {
  private readonly _appManager: IAppManager;
  private readonly _core: ICore;
  private origin = "";

  private kernelMethods: KernelMethods = {
    kernelMethodNotFound: () =>
      this._core.appManager.SendDataToApp<Error>(
        this.origin,
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
      this._core.fileSystem
        .ShowFilesInDir(props)
        .then((res: Array<Directory>) =>
          this._core.appManager.SendDataToApp<Array<Directory>>(
            this.origin,
            res,
            system,
            EventName.SelfInvoked
          )
        ),

    readFile: (props: Path) =>
      this._core.fileSystem
        .OpenFile(props)
        .then((res: string) =>
          this._core.appManager.SendDataToApp<string>(
            this.origin,
            res,
            system,
            EventName.SelfInvoked
          )
        ),

    changeDir: (props: Path) =>
      this._core.fileSystem
        .ChangeDirectory(props)
        .then((res: string) =>
          this._core.appManager.SendDataToApp(
            this.origin,
            res,
            system,
            EventName.SelfInvoked
          )
        ),

    mkdir: (props: Mkdir) => {
      this._core.fileSystem
        .MakeDirectory(props)
        .then((res: string) =>
          this._core.appManager.SendDataToApp<string>(
            this.origin,
            res,
            system,
            EventName.SelfInvoked
          )
        );
    },

    rmdir: (props: Path) => {
      this._core.fileSystem
        .RemoveDirectory(props)
        .then((res: string) =>
          this._core.appManager.SendDataToApp<string>(
            this.origin,
            res,
            system,
            EventName.SelfInvoked
          )
        );
    },

    touch: (props: Path) => {
      this._core.fileSystem
        .CreateFile(props)
        .then((res: string) =>
          this._core.appManager.SendDataToApp<string>(
            this.origin,
            res,
            system,
            EventName.SelfInvoked
          )
        );
    },

    //Window operations
    closeSelf: () => this._core.appManager.CloseApplication(this.origin),
    openFile: (props: OpenFile) =>
      this._core.appManager.openApplicationWithMimeType(this.origin, props),
  };

  constructor(
    @inject(types.AppManager) appManager: IAppManager,
    @inject(types.Core) core: ICore
  ) {
    this._appManager = appManager;
    this._core = core;
  }
  public ListenToCommunication(): void {
    window.onmessage = (event: MessageEvent) => {
      const messageData: JsOsCommunicationMessage = event.data;

      if (!this._appManager.CheckIfAppExists(messageData.origin))
        throw new Error("Sender app is not known!");

      this.origin = messageData.origin;

      this.ProcessMethod(messageData);
    };
  }

  // eslint-disable-next-line complexity
  private ProcessMethod(props: JsOsCommunicationMessage) {
    try {
      this.kernelMethods[props.method as ValidMethods](props.params);
    } catch (error) {
      this.kernelMethods.kernelMethodNotFound();
    }
  }
}

export default Kernel;
