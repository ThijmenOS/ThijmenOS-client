import { ICommand } from "@ostypes/CommandTypes";
import Processes from "@core/processManager/processes";

class Terminate extends Processes implements ICommand {
  Handle(pid: string): void {
    const targetProcess = this.FindProcess(pid);
    if (!targetProcess) {
      return;
    }

    targetProcess.Terminate();
    this.RemoveApplicationInstance(pid);
  }
}

export default Terminate;
