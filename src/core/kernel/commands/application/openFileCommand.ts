import { CommandReturn, ICommand } from "@ostypes/CommandTypes";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { OpenFileType } from "@core/kernel/kernelTypes";
import ApplicationManager from "@core/applicationManager/applicationManagerMethodShape";
import { EventName } from "@ostypes/AppManagerTypes";

class OpenFileCommand implements ICommand {
  private readonly _applicationManager: ApplicationManager =
    javascriptOs.get<ApplicationManager>(types.AppManager);
  private readonly props: OpenFileType;

  constructor(props: OpenFileType) {
    this.props = props;
  }

  Handle(): CommandReturn<boolean> {
    const openedApplication = this._applicationManager.OpenFile(this.props);

    return new CommandReturn<boolean>(
      openedApplication,
      EventName.OpenedExternalApplication
    );
  }
}

export default OpenFileCommand;
