import { windows } from "../app-regestry/window/appWindow.js";
import Core from "./core.js";
import { FileInDir, KernelMethods, ValidMethods } from "@interface/kernel";

class Kernel {
  private core: Core;
  private origin: string = "";

  private kernelMethods: KernelMethods = {
    testCommand: (targetApp: string) =>
      this.core.rootUtils.SendDataToApp(targetApp, "test123", "system"),

    //FileSystem
    filesInDir: (props: FileInDir) =>
      this.core.fileSystem
        .showFilesInDir(props.targetPath)
        .then((res) =>
          this.core.rootUtils.SendDataToApp(this.origin, res, "system")
        ),
  };

  constructor() {
    this.core = new Core();
    this.ListenToCommunication();
  }
  private ListenToCommunication() {
    window.onmessage = (event: MessageEvent) => {
      if (event.origin != "https://thijmenbrand.nl")
        throw new Error("Origin is not trusted!");

      let messageData: JsOsCommunicationMessage = event.data;

      if (
        !windows.find(
          (win) => win.windowOptions.windowTitle === messageData.origin
        )
      )
        throw new Error("Sender app is not known!");

      this.origin = messageData.origin;

      this.ProcessMethod(messageData);
    };
  }

  private ProcessMethod(props: JsOsCommunicationMessage) {
    switch (props.method) {
      //File stuff
      case "testCommand":
        this.ExcecuteMethod<string>(ValidMethods.testCommand, props.origin);
        break;
      // case "filesInDir":
      //   this.ExcecuteMethod<FileInDir>(ValidMethods.testCommand, props.params);
      //   break;
      // case "openFile":
      //   core.fileSystem
      //     .openFile(props.params)
      //     .then((res) => this.#sendDataToApp(props.origin, res, "system"));
      //   break;

      // //Settings
      // case "changeBackground":
      //   core.settings.setApplicationBackground(params);
      //   break;

      // //App stuff
      // case "openApp":
      //   core.appRegistry
      //     .application(params)
      //     .then((e) => e.initWindow())
      //     .finally(() => this.#sendDataToApp(props.origin, true, "system"));
      //   break;
      // case "selectFile":
      //   core.appRegistry
      //     .application("userFiles/D/desktop/file-explorer.thijm")
      //     .then((e) => e.initWindow())
      //     .finally(() =>
      //       this.#sendDataToApp("Explorer", "selectFile", props.origin)
      //     );
      //   break;
      // case "sendData":
      //   this.#sendDataToApp(params.target, params.data, props.origin);
      //   break;
      // case "closeSelf":
      //   core.rootUtils.closeWindow(props.origin);
      //   break;
    }
  }

  private ExcecuteMethod<T>(method: ValidMethods, props: T) {
    this.kernelMethods[method](props);
  }
}

export default Kernel;
