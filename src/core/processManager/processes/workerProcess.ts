import KernelMethodShape from "@core/kernel/kernelMethodShape";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import {
  ProcessArgs,
  ApplicationInstance,
  Process,
  WorkerProcessMethods,
} from "../interfaces/baseProcess";

class WorkerProcess
  extends ApplicationInstance<Worker>
  implements WorkerProcessMethods
{
  private readonly _kernel: KernelMethodShape =
    javascriptOs.get<KernelMethodShape>(types.Kernel);

  constructor(args: ProcessArgs<Worker>) {
    super(args);
  }

  public AddEventListener(): void {
    this.origin.addEventListener("message", (event) => {
      this._kernel.ProcessMethod({
        origin: this,
        processIdentifier: this.processIdentifier,
        ...event.data,
      });
    });
  }

  public Terminate(): void {
    this._childProcesses?.forEach((process) => {
      process.Terminate();
    });

    this.origin.terminate();
  }
}

export default WorkerProcess;
