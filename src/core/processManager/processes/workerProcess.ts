import KernelMethodShape from "@core/kernel/kernelMethodShape";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { ApplicationInstance } from "./baseProcess";
import { ProcessMessage } from "@core/kernel/kernelTypes";
import { BackgroundArgs } from "../interfaces/process";

class WorkerProcess extends ApplicationInstance {
  private readonly _kernel: KernelMethodShape =
    javascriptOs.get<KernelMethodShape>(types.Kernel);

  private _element: HTMLIFrameElement;

  constructor(args: BackgroundArgs) {
    super(args);

    this._element = args.iframeElement;
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

    this._element.remove();
  }
}

export default WorkerProcess;
