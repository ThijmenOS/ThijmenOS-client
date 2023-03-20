import ApplicationWindowMethodShape from "@providers/gui/applicationWindow/interfaces/applicationWindowMethodShape";
import {
  GlobalProcessArgs,
  ApplicationInstance,
} from "../interfaces/baseProcess";

class WindowProcess extends ApplicationInstance {
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
