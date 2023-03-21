import KernelMethodShape from "@core/kernel/kernelMethodShape";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import {
  GlobalProcessArgs,
  ApplicationInstance,
} from "../interfaces/baseProcess";

class WorkerProcess extends ApplicationInstance<Worker> {
  private readonly _kernel: KernelMethodShape =
    javascriptOs.get<KernelMethodShape>(types.Kernel);

  constructor(args: GlobalProcessArgs<Worker>) {
    super(args);
  }

  public AddEventListener(): void {
    this.origin.addEventListener("message", (event) => {
      this._kernel.ProcessMethod({
        origin: this.origin,
        processIdentifier: this.processIdentifier,
        ...event.data,
      });
    });
  }

  public Terminate(): void {
    this.origin.terminate();
  }
}

export default WorkerProcess;
