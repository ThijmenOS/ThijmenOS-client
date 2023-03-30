import { ICommand } from "@ostypes/CommandTypes";
import ApplicationCommunicationModel from "@core/kernel/models/applicationCommunication";
import { CommunicationEvent } from "@core/kernel/models/CommunicationEvent";
import { WaitForElm } from "@providers/gui/helpers/WaitForElement";
import WorkerProcess from "@core/processManager/processes/workerProcess";
import WindowProcess from "@core/processManager/processes/windowProcess";

class Communication<T> implements ICommand {
  private readonly props: ApplicationCommunicationModel<T>;

  constructor(args: ApplicationCommunicationModel<T>) {
    this.props = args;
  }

  Handle(): void {
    //TODO: Make a distinguishment between window processes and background processes. <Maybe backgroundprocesses also in Iframes but not shown>

    //TODO: In development I can throw. But in the end log the incident with as much information as possible
    //TODO: Create logger

    const event: CommunicationEvent<T> = {
      eventName: this.props.eventName,
      eventData: this.props.data,
    };
    if (!this.props.worker.origin) {
      return;
    }

    if (this.props.worker instanceof WorkerProcess) {
      this.WorkerMessage(this.props.worker.origin, event);
    }

    if (this.props.worker instanceof WindowProcess) {
      this.WindowMessage(this.props.worker.origin, event);
    }
  }

  private WorkerMessage(worker: Worker, event: CommunicationEvent<T>) {
    worker.postMessage(event);
  }

  private WindowMessage(window: Window, event: CommunicationEvent<T>) {
    WaitForElm<HTMLIFrameElement>(this.props.worker.processIdentifier).then(
      () => {
        setTimeout(() => {
          window.postMessage(event, "*");
        }, 100);
      }
    );
  }
}

export default Communication;
