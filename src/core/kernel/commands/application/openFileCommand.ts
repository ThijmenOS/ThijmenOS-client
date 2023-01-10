import { ICommand } from "@ostypes/CommandTypes";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { OpenFileType } from "@core/kernel/kernelTypes";
import ApplicationManager from "@core/applicationManager/applicationManagerMethodShape";

class OpenFileCommand implements ICommand {
  private readonly _applicationManager: ApplicationManager =
    javascriptOs.get<ApplicationManager>(types.AppManager);
  private readonly props: OpenFileType;

  constructor(props: OpenFileType) {
    this.props = props;
  }

  Handle(): void {
    this._applicationManager.OpenFile(this.props);
  }
}

export default OpenFileCommand;
