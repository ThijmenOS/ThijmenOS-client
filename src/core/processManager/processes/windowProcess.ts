import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import WindowConstructorMethods from "@providers/gui/applicationWindow/interfaces/windowConstructorMethods";
import { BaseProcess } from "./baseProcess";
import ApplicationWindow from "@providers/gui/applicationWindow/applicationWindow";
import KernelMethodShape from "@core/kernel/kernelMethodShape";
import { ProcessState } from "../types/processState";
import Metadata from "../types/processMetadata";
import StartupArgs from "../interfaces/startupArgs";

export class WindowProcessV2 extends BaseProcess<ApplicationWindow> {
  private readonly _kernel = javascriptOs.get<KernelMethodShape>(types.Kernel);
  private readonly _windowConstructor =
    javascriptOs.get<WindowConstructorMethods>(types.CreateWindow);

  constructor(
    exePath: string,
    name: string,
    args?: string,
    parentPid?: number
  ) {
    super(name, exePath, "window (.html)");

    this.Initialise(exePath, args, parentPid);
  }

  public async Initialise(exePath: string, args?: string, parentPid?: number) {
    this.code = await this._windowConstructor.Window(exePath, this.pid);

    this.parentPid = parentPid;
    const metadata: Metadata = {
      parentPid: parentPid,
      processType: this.processType,
    };

    this.RegisterProcess();
    this.ListenToSysCalls();
    this.code.windowContent.addEventListener("load", () =>
      this.Startup(metadata, args)
    );

    window.addEventListener(
      "message",
      ({ data }) => {
        if (Number(data.pid) !== this.pid) return;

        if (data.method === "startup") {
          if (!this.code) return;

          if (!data.params) {
            this.code.Show();
          }

          this.StartupArgs(this.code, data.params);
          this.code.Show();
        }
      },
      { once: true }
    );

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

  private StartupArgs(applicationWindow: ApplicationWindow, args: StartupArgs) {
    if (!args.winX || !args.winX) return;

    if (args.winX > window.innerWidth) {
      args.winX = window.innerWidth;
    }

    if (args.winY > window.innerHeight) {
      args.winY = window.innerHeight;
    }

    applicationWindow.SetWindowSize(args.winX, args.winY);
  }
}
