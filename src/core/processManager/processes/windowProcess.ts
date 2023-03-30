import KernelMethodShape from "@core/kernel/kernelMethodShape";
import { ProcessMessage } from "@core/kernel/kernelTypes";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import ApplicationWindow from "@providers/gui/applicationWindow/applicationWindow";
import {
  GlobalProcessArgs,
  ApplicationInstance,
} from "../interfaces/baseProcess";

class WindowProcess extends ApplicationInstance<Window> {
  private readonly _kernel: KernelMethodShape =
    javascriptOs.get<KernelMethodShape>(types.Kernel);

  private applicationWindow: ApplicationWindow;

  constructor(
    args: GlobalProcessArgs<Window>,
    applicationWindow: ApplicationWindow
  ) {
    super(args);

    this.applicationWindow = applicationWindow;
  }

  public AddEventListener(): void {
    //TODO: Throw application crash
    if (window === null) throw new Error();

    window.addEventListener("message", (event) => {
      const message: ProcessMessage = event.data;

      if (message.origin !== this.processIdentifier) return;

      this._kernel.ProcessMethod({
        origin: this,
        processIdentifier: message.origin,
        method: message.method,
        params: message.params,
      });
    });
  }
  Terminate(): void {
    this.applicationWindow.Destroy();
  }
}

export default WindowProcess;
