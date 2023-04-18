import ProcessesShape from "@core/processManager/interfaces/processesShape";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import { EventName } from "@ostypes/ProcessTypes";
import types from "@ostypes/types";
import Communication from "../application/communication";

class CommunicateToProcess implements ICommand {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  private readonly _targetPid: string;
  private readonly _data: unknown;

  constructor(args: { data: unknown; targetPid: string }) {
    this._targetPid = args.targetPid;
    this._data = args.data;
  }

  public Handle() {
    //Op basis van exe pad  het process starten en runnen.
    const targetProcess = this._processes.FindProcess(this._targetPid);

    if (!targetProcess) return;

    new Communication({
      data: this._data,
      eventName: EventName.SelfInvoked,
      worker: targetProcess.origin,
    }).Handle();
  }
}

export default CommunicateToProcess;
