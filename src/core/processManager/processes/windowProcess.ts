import ApplicationWindowMethodShape from "@providers/gui/applicationWindow/interfaces/applicationWindowMethodShape";
import { ChildProcess, GlobalProcessArgs } from "../interfaces/baseProcess";

class WindowProcess extends ChildProcess {
  private _window: ApplicationWindowMethodShape;

  constructor(
    args: GlobalProcessArgs,
    applicationWindow: ApplicationWindowMethodShape
  ) {
    super(args);

    this._window = applicationWindow;
  }

  Terminate(): void {
    this._window.Destroy();
  }
}

export default WindowProcess;
