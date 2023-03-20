import { ICommand } from "@ostypes/CommandTypes";
import ApplicationCommunicationModel from "@core/kernel/models/applicationCommunication";
import { CommunicationEvent } from "@core/kernel/models/CommunicationEvent";
import { WaitForElm } from "@providers/gui/helpers/WaitForElement";

class Communication<T> implements ICommand {
  private readonly props: ApplicationCommunicationModel<T>;

  constructor(args: ApplicationCommunicationModel<T>) {
    this.props = args;
  }

  Handle(): void {
    //TODO: Make a distinguishment between window processes and background processes. <Maybe backgroundprocesses also in Iframes but not shown>

    //TODO: In development I can throw. But in the end log the incident with as much information as possible
    //TODO: Create logger
    if (!this.props.processIdentifier)
      throw new Error("No app or sender specified!");

    const event: CommunicationEvent<T> = {
      eventName: this.props.eventName,
      eventData: this.props.data,
    };

    WaitForElm<HTMLIFrameElement>(this.props.processIdentifier).then(
      (res: HTMLIFrameElement) => {
        setTimeout(() => {
          res.contentWindow?.postMessage(event, "*");
        }, 200);
      }
    );
  }
}

export default Communication;
