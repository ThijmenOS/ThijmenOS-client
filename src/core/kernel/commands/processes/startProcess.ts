import { ProcessV2 } from "@core/processManager/processes/process";
import { WindowProcessV2 } from "@core/processManager/processes/windowProcess";
import { ICommand } from "@ostypes/CommandTypes";

//TODO: Provide functionality to give process args list file open path and such
class StartProcess implements ICommand {
  private readonly _exePath: string;
  private readonly _args?: string;

  constructor(args: { exePath: string; args?: string }) {
    this._exePath = args.exePath;
    this._args = args.args;
  }

  public async Handle(): Promise<void> {
    const mimetype = this._exePath.split(".").at(-1);
    if (mimetype === "html") {
      new WindowProcessV2().Initialise(this._exePath, this._args);
    }
    if (mimetype === "js") {
      new ProcessV2(this._exePath, this._args);
    }
  }
}

export default StartProcess;
