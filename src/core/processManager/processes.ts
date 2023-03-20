import ApplicationManager from "@core/ApplicationManager/ApplicationManagerMethods";
import types from "@ostypes/types";
import CouldNotStartProcess from "@providers/error/errors/couldNotStartProcess";
import { ApplicationMetaData } from "@thijmen-os/common";
import { inject, injectable } from "inversify";
import {
  ApplicationInstance,
  ChildProcess,
  GlobalProcess,
} from "./interfaces/baseProcess";

@injectable()
class Processes {
  private readonly _applicationManager: ApplicationManager;

  private _runningProcesses: Array<ApplicationInstance> =
    new Array<ApplicationInstance>();

  constructor(
    @inject(types.AppManager) applicationManager?: ApplicationManager
  ) {
    this._applicationManager = applicationManager!;
  }

  public RegisterRunningProcess = (
    newProcess: ApplicationInstance | ChildProcess
  ) => {
    if (newProcess instanceof ApplicationInstance) {
      this._runningProcesses.push(newProcess);
      return;
    }

    const runningProcess = this._runningProcesses.find(
      (p) => p.applicationIdentifier === newProcess.applicationIdentifier
    );

    if (!runningProcess) {
      throw new CouldNotStartProcess("The target process could not be started");
    }

    runningProcess.AttachProcess(newProcess);
  };

  public checkIfApplicationIsAvailableProcess = (
    applicationIdentifier: string
  ): ApplicationMetaData =>
    this._applicationManager.CheckIfApplicationIsAvailableProcess(
      applicationIdentifier
    );

  public FindApplicationInstance = (
    applicationIdentifier: string
  ): ApplicationInstance | false =>
    this._runningProcesses.find(
      (process) => process.applicationIdentifier === applicationIdentifier
    ) ?? false;

  public FindProcess(processIdentifier: string): GlobalProcess | false {
    const targetProcess = this._runningProcesses.find(
      (x) =>
        x.processIdentifier === processIdentifier ||
        x.attachedProcesses?.find(
          (y) => y.processIdentifier === processIdentifier
        )
    );

    if (!targetProcess) return false;

    return targetProcess;
  }

  protected RemoveApplicationInstance = (applicationIdentifier: string) =>
    this._runningProcesses.splice(
      this._runningProcesses.findIndex(
        (x) => x.applicationIdentifier === applicationIdentifier
      ),
      1
    );
}

export default Processes;
