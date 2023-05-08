import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import WindowConstructorMethods from "@providers/gui/applicationWindow/interfaces/windowConstructorMethods";
import { BaseProcess } from "./baseProcess";
import ApplicationWindow from "@providers/gui/applicationWindow/applicationWindow";
import KernelMethodShape from "@core/kernel/kernelMethodShape";

export class WindowProcessV2 extends BaseProcess<ApplicationWindow> {
  private readonly _kernel = javascriptOs.get<KernelMethodShape>(types.Kernel);
  private readonly _windowConstructor =
    javascriptOs.get<WindowConstructorMethods>(types.CreateWindow);

  constructor() {
    super();
  }

  public async Initialise(exePath: string, args?: string) {
    this.code = await this._windowConstructor.Window(exePath, this.pid);

    this.RegisterProcess();
    this.ListenToSysCalls();
    setTimeout(() => {
      this.Startup(args);
    }, 100);
  }

  public Terminate(): void {
    this.code?.Destroy();
  }

  private ListenToSysCalls() {
    window.addEventListener("message", ({ data }) => {
      this._kernel.ProcessMethod({
        origin: this,
        pid: this.pid,
        ...data,
      });
    });
  }
}
