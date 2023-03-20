import ApplicationManager from "@core/ApplicationManager/ApplicationManagerMethods";
import { ApplicationInstance } from "@core/processManager/interfaces/baseProcess";
import Processes from "@core/processManager/processes";
import WindowProcess from "@core/processManager/processes/windowProcess";
import javascriptOs from "@inversify/inversify.config";
import { ICommand } from "@ostypes/CommandTypes";
import types from "@ostypes/types";
import ProcessAlreadyRunning from "@providers/error/errors/processAlreadyRunning";
import CreateWindow from "@providers/gui/applicationWindow/createApplicationWindow";
import createApplicationWindowMethodShape from "@providers/gui/applicationWindow/interfaces/createApplicationWindowMethodShape";
import { ApplicationMetaData } from "@thijmen-os/common";

class StartProcess extends Processes implements ICommand {
  private readonly _window: CreateWindow =
    javascriptOs.get<createApplicationWindowMethodShape>(types.CreateWindow);
  private readonly _applicationManager: ApplicationManager =
    javascriptOs.get<ApplicationManager>(types.AppManager);

  private target: string;

  constructor(target: string) {
    super();

    this.target = target;
  }

  public Handle() {
    const processRunning: ApplicationInstance | false =
      this.FindApplicationInstance(this.target);

    const application = this.checkIfApplicationIsAvailableProcess(
      this.applicationIdentifier
    );

    if (!processRunning) {
      this.RegisterRunningProcess(this.InitialiseProcess(application));
    }

    if (processRunning && processRunning.singleton) {
      throw new ProcessAlreadyRunning("The process is already running");
    }

    if (processRunning && !processRunning.singleton) {
      processRunning.AttachProcess(this.InitialiseProcess(application));
    }
  }

  private InitialiseProcess(args: ApplicationMetaData): WindowProcess {
    const applicationWindow = this._window.Application(args);

    return new WindowProcess(
      {
        applicationIdentifier: this.applicationIdentifier,
        processIdentifier: applicationWindow.windowOptions.windowIdentifier,
        processMetadata: args,
      },
      applicationWindow
    );
  }
}

export default StartProcess;
