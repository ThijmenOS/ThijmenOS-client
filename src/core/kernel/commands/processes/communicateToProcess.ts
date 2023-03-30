import Processes from "@core/processManager/processes";
import { ICommand } from "@ostypes/CommandTypes";
import { EventName } from "@ostypes/ProcessTypes";
import Communication from "../application/communication";

class CommunicateToProcess extends Processes implements ICommand {
  private pid: string;
  private data: unknown;

  constructor(args: { data: unknown; pid: string }) {
    super();

    this.pid = args.pid;
    this.data = args.data;
  }

  public Handle() {
    //Op basis van exe pad  het process starten en runnen.
    const targetProcess = this.FindProcess(this.pid);

    new Communication({
      data: this.data,
      eventName: EventName.SelfInvoked,
      worker: targetProcess?.origin,
    }).Handle();
  }
}

export default CommunicateToProcess;
