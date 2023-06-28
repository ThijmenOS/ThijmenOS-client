import Thread from "./thread";
import { BaseProcess } from "./baseProcess";
import javascriptOs from "@inversify/inversify.config";
import KernelMethodShape from "@core/kernel/kernelMethodShape";
import types from "@ostypes/types";
import { ProcessState } from "../types/processState";
import Metadata from "../types/processMetadata";

export class ProcessV2 extends BaseProcess<Thread> {
  private readonly _kernel = javascriptOs.get<KernelMethodShape>(types.Kernel);

  constructor(
    exePath: string,
    name: string,
    args?: string,
    parentPid?: number
  ) {
    super(name, exePath, "Application (.js)");

    this.code = new Thread(exePath);
    this.parentPid = parentPid;
    const metadata: Metadata = {
      parentPid: parentPid,
      processType: this.processType,
    };

    this.RegisterProcess();
    this.ListenToSysCalls(this.code.worker);
    this.Startup(metadata, args);
  }

  public Terminate(exitCode: number): void {
    this.FreeResources();
    this.code?.worker.terminate();
    this.state = ProcessState.Terminated;
    this.exitCode = exitCode;
  }

  private ListenToSysCalls(code: Worker) {
    code.addEventListener("message", ({ data }) => {
      if (data.id === "startup") return;

      this._kernel.ProcessMethod({
        origin: this,
        pid: this.pid,
        ...data,
      });
    });
  }
}
