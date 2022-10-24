import {
  Path,
  KernelMethods,
  ValidMethods,
  JsOsCommunicationMessage,
} from "@interface/kernel/kernelTypes";
import { inject, injectable } from "inversify";
import { IKernel } from "@interface/kernel/kernel.js";
import types from "@interface/types";
import { IAppManager } from "@interface/appManager.js";
import { ICore } from "@interface/core/core.js";
import { directory } from "@interface/fileSystem/fileSystemTypes";

@injectable()
class Kernel implements IKernel {
  private readonly _appManager: IAppManager;
  private readonly _core: ICore;
  private origin = "";

  private kernelMethods: KernelMethods = {
    kernelMethodNotFound: () =>
      this._core.appManager.SendDataToApp<Error>(
        this.origin,
        new Error("Error: The requested kernel method does not exist"),
        "system"
      ),

    testCommand: (targetApp: string): void =>
      this._core.appManager.SendDataToApp<string>(
        targetApp,
        "test123",
        "system"
      ),

    //FileSystem
    filesInDir: (props: Path) =>
      this._core.fileSystem
        .ShowFilesInDir(props)
        .then((res) =>
          this._core.appManager.SendDataToApp<Array<directory>>(
            this.origin,
            res,
            "system"
          )
        ),

    readFile: (props: Path) =>
      this._core.fileSystem
        .OpenFile(props)
        .then((res) =>
          this._core.appManager.SendDataToApp<string>(
            this.origin,
            res,
            "system"
          )
        ),

    //Window operations
    closeSelf: () => this._core.appManager.CloseApplication(this.origin),
    openFile: (mimeType: string) =>
      this._core.appManager.openApplicationWithMimeType(this.origin, mimeType),
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
    switch (props.method) {
      case "testCommand":
        this.ExcecuteMethod<string>(ValidMethods.testCommand, props.origin);
        break;
      case "filesInDir":
        this.ExcecuteMethod<Path>(
          ValidMethods.filesInDir,
          props.params as string
        );
        break;
      case "readFile":
        this.ExcecuteMethod<Path>(
          ValidMethods.readFile,
          props.params as string
        );
        break;
      case "closeSelf":
        this.ExcecuteMethod<void>(ValidMethods.closeSelf);
        break;
      case "openFile":
        this.ExcecuteMethod<string>(
          ValidMethods.openFile,
          props.params as string
        );
        break;
      default:
        this.ExcecuteMethod<void>(ValidMethods.kernelMethodNotFound);
        break;
    }
  }

  private ExcecuteMethod<T>(method: ValidMethods, props?: T) {
    this.kernelMethods[method](props);
  }
}

export default Kernel;
