import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { BaseProcess } from "./baseProcess";
import ApplicationWindow from "@providers/gui/applicationWindow/applicationWindow";
import KernelMethodShape from "@core/kernel/kernelMethodShape";
import { ProcessState } from "../types/processState";
import Metadata from "../types/processMetadata";
import Window from "@providers/gui/applicationWindow/windowConstructor";
import WindowOptions from "@ostypes/WindowTypes";

export class WindowProcessV2 extends BaseProcess<ApplicationWindow> {
  private readonly _kernel = javascriptOs.get<KernelMethodShape>(types.Kernel);

  constructor(
    exePath: string,
    name: string,
    windowOptions: WindowOptions,
    args?: string,
    parentPid?: number
  ) {
    super(name, exePath, "window (.html)");

    this.Initialise(exePath, windowOptions, args, parentPid);
  }

  public async Initialise(
    exePath: string,
    windowOptions: WindowOptions,
    args?: string,
    parentPid?: number
  ) {
    this.code = await new Window(exePath, this.pid, windowOptions).Construct();

    this.parentPid = parentPid;
    const metadata: Metadata = {
      parentPid: parentPid,
      processType: this.processType,
    };

    this.RegisterProcess();
    this.ListenToSysCalls();
    this.code.OnLoad(() => this.Startup(metadata, args));

    return this;
  }

  public Terminate(exitCode: number): void {
    this.FreeResources();
    this.code?.Destroy();
    this.state = ProcessState.Terminated;
    this.exitCode = exitCode;
  }

  private ListenToSysCalls() {
    window.addEventListener("message", ({ data }) => {
      if (Number(data.pid) !== this.pid || data.method === "startup") return;
      this._kernel.ProcessMethod({
        origin: this,
        pid: this.pid,
        ...data,
      });
    });
  }
}
