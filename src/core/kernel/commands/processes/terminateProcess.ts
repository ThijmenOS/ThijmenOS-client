import Processes from "@core/processManager/processes";
import { ICommand } from "@ostypes/CommandTypes";

class TerminateProcess extends Processes implements ICommand {
  private readonly processIdentifier: string;
  private readonly applicationIdentifier: string;

  constructor(applicationIdentifier: string, processIdentifier: string) {
    super();

    this.processIdentifier = processIdentifier;
    this.applicationIdentifier = applicationIdentifier;
  }

  public Handle() {
    const targetApplication = this.FindApplicationInstance(
      this.applicationIdentifier
    );

    if (targetApplication) {
      targetApplication.Terminate();
      this.RemoveApplicationInstance(this.applicationIdentifier);
      return;
    }

    const targetProcess = this.FindProcess(this.processIdentifier);

    if (!targetProcess) return;

    targetProcess.Terminate();
  }
}

export default TerminateProcess;
