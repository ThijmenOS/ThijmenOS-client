import Thread from "./thread";
import { BaseProcess } from "./baseProcess";
import javascriptOs from "@inversify/inversify.config";
import KernelMethodShape from "@core/kernel/kernelMethodShape";
import types from "@ostypes/types";

export class ProcessV2 extends BaseProcess<Thread> {
  private readonly _kernel = javascriptOs.get<KernelMethodShape>(types.Kernel);

  constructor(exePath: string, args?: string) {
    super();

    this.code = new Thread(exePath);

    this.RegisterProcess();
    this.ListenToSysCalls(this.code.worker);
    this.Startup(args);
  }

  public Terminate(): void {
    this.code?.worker.terminate();
  }

  private ListenToSysCalls(code: Worker) {
    code.addEventListener("message", ({ data }) => {
      this._kernel.ProcessMethod({
        origin: this,
        pid: this.pid,
        ...data,
      });
    });
  }
}
