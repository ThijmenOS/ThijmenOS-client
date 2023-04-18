import ProcessesShape from "@core/processManager/interfaces/processesShape";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import Communication from "../application/communication";
import Exit from "@providers/error/systemErrors/Exit";

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

  public Handle(): Exit {
    //Op basis van exe pad  het process starten en runnen.
    const result = this._processes.FindProcess(this._targetPid);

    if (result instanceof Exit) {
      return result;
    }

    new Communication({
      exit: new Exit(undefined, this._data),
      worker: result,
    }).Handle();

    return new Exit();
  }
}

export default CommunicateToProcess;
