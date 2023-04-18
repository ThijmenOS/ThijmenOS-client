import KernelMethodShape from "@core/kernel/kernelMethodShape";
import { ProcessMessage } from "@core/kernel/kernelTypes";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import ApplicationWindow from "@providers/gui/applicationWindow/applicationWindow";
import { ApplicationInstance } from "./baseProcess";
import { WindowArgs } from "../interfaces/process";

class WindowProcess extends ApplicationInstance {
  private readonly _kernel: KernelMethodShape =
    javascriptOs.get<KernelMethodShape>(types.Kernel);

  private _applicationWindow: ApplicationWindow;

  constructor(args: WindowArgs) {
    super(args);

    this._applicationWindow = args.applicationWindow;
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

  public Terminate(): void {
    this._childProcesses?.forEach((process) => {
      process.Terminate();
    });

    this._applicationWindow.Destroy();
  }
}

export default WindowProcess;
