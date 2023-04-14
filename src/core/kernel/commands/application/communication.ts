import { ICommand } from "@ostypes/CommandTypes";
import ApplicationCommunicationModel from "@core/kernel/models/applicationCommunication";
import { CommunicationEvent } from "@core/kernel/models/CommunicationEvent";

class Communication<T> implements ICommand {
  private readonly _props: ApplicationCommunicationModel<T>;

  constructor(args: ApplicationCommunicationModel<T>) {
    this._props = args;
  }

  Handle(): void {
    //TODO: Make a distinguishment between window processes and background processes. <Maybe backgroundprocesses also in Iframes but not shown>

    //TODO: In development I can throw. But in the end log the incident with as much information as possible
    //TODO: Create logger

    const event: CommunicationEvent<T> = {
      eventName: this._props.eventName,
      eventData: this._props.data,
    };

    if (this._props.worker) {
      setTimeout(() => {
        this._props.worker.postMessage(event, { targetOrigin: "*" });
      }, 1000);
    }

    // WaitForElm<HTMLIFrameElement>(this.props.processIdentifier).then(
    //   (res: HTMLIFrameElement) => {
    //     setTimeout(() => {
    //       res.contentWindow?.postMessage(event, "*");
    //     }, 200);
    //   }
    // );
  }
}

export default Communication;
