import { ApplicationInstance } from "@core/processManager/processes/process";
import { ICommand } from "@ostypes/CommandTypes";
import StartProcess from "../processes/startProcess";

class SelectFile implements ICommand {
  private readonly _explorerPath = "C/ProgramFiles/fileexplorer/index.html";
  private readonly _args = ["--mode", "file_select"];

  public Handle(process?: ApplicationInstance): void {
    //TODO: Make this path not hardcoded

    if (!process) throw new Error("process not found");

    this._args.push(...["--pid", process.processIdentifier]);

    new StartProcess({
      exePath: this._explorerPath,
      args: this._args.join(" "),
    }).Handle(process);
  }
}

export default SelectFile;
