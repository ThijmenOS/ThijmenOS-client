import Processes from "@core/processManager/processes";
import { ICommand } from "@ostypes/CommandTypes";

class TerminateProcess extends Processes implements ICommand {
  private readonly _processIdentifier: string;

  constructor(processIdentifier: string) {
    super();

    this._processIdentifier = processIdentifier;
  }

  public Handle() {
    const targetProcess = this.FindProcess(this._processIdentifier);
    if (!targetProcess) return;

    targetProcess.Terminate();

    this.RemoveApplicationInstance(this._processIdentifier);
  }
}

export default TerminateProcess;
