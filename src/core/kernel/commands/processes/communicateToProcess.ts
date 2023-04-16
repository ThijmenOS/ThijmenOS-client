import Processes from "@core/processManager/processes";
import { ICommand } from "@ostypes/CommandTypes";
import { EventName } from "@ostypes/ProcessTypes";
import Communication from "../application/communication";

class CommunicateToProcess extends Processes implements ICommand {
  private readonly _targetPid: string;
  private readonly _data: unknown;

  constructor(args: { data: unknown; targetPid: string }) {
    super();

    this._targetPid = args.targetPid;
    this._data = args.data;
  }

  public Handle() {
    //Op basis van exe pad  het process starten en runnen.
    const targetProcess = this.FindProcess(this._targetPid);

    if (!targetProcess) return;

    if (!targetProcess) return;

    new Communication({
      data: this._data,
      eventName: EventName.SelfInvoked,
      worker: targetProcess.origin,
    }).Handle();
  }
}

export default CommunicateToProcess;
