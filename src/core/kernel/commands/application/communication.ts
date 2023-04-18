import { ICommand } from "@ostypes/CommandTypes";
import ApplicationCommunicationModel from "@core/kernel/models/applicationCommunication";
import { WaitForElm } from "@providers/gui/helpers/WaitForElement";
import Exit from "@providers/error/systemErrors/Exit";
class Communication<T> implements ICommand {
  private readonly _props: ApplicationCommunicationModel<T>;

  constructor(args: ApplicationCommunicationModel<T>) {
    this._props = args;
  }

  Handle(): void {
    //TODO: Make a distinguishment between window processes and background processes. <Maybe backgroundprocesses also in Iframes but not shown>

    //TODO: In development I can throw. But in the end log the incident with as much information as possible
    //TODO: Create logger

    if (!this._props.worker.origin) {
      return;
    }

    this.SendMessage(this._props.worker.origin, this._props.exit);
  }

  private SendMessage(window: Window, event: Exit<T>) {
    WaitForElm<HTMLIFrameElement>(this._props.worker.processIdentifier).then(
      () => {
        window.postMessage(event, "*");
      }
    );
  }
}

export default Communication;
