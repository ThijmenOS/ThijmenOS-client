import Processes from "@core/processManager/processes";
import { ICommand } from "@ostypes/CommandTypes";

class TerminateProcess extends Processes implements ICommand {
  private readonly processIdentifier: string;

  constructor(processIdentifier: string) {
    super();

    this.processIdentifier = processIdentifier;
  }

  public Handle() {
    const targetProcess = this.FindProcess(this.processIdentifier);
    if (!targetProcess) return;

    targetProcess.Terminate();

    this.RemoveApplicationInstance(this.processIdentifier);
  }
}

export default TerminateProcess;
