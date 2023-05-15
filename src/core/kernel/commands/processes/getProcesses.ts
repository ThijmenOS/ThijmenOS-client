import ProcessesShape from "@core/processManager/interfaces/processesShape";
import { ProcessState } from "@core/processManager/types/processState";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";

class ProcessInformation {
  pid: number;
  name: string;
  location: string;
  processType: string;

  constructor(
    pid: number,
    name: string,
    location: string,
    processType: string
  ) {
    this.pid = pid;
    this.name = name;
    this.location = location;
    this.processType = processType;
  }
}

class GetProcesses implements ICommand {
  private readonly _processes = javascriptOs.get<ProcessesShape>(
    types.ProcessManager
  );

  Handle(): Array<ProcessInformation> {
    const processes = this._processes.GetAllProcesses();
    const livingProcesses = processes.filter(
      (process) => process.state !== ProcessState.Terminated
    );

    const extractedFields: Array<ProcessInformation> = livingProcesses.map(
      ({ pid, name, location, processType }) =>
        new ProcessInformation(pid, name, location, processType)
    );

    return extractedFields;
  }
}

export default GetProcesses;
