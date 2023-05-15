import { ICommand } from "@ostypes/CommandTypes";
import StartProcess from "../processes/startProcess";
import { BaseProcess } from "@core/processManager/processes/baseProcess";

class SelectFile implements ICommand {
  private readonly _explorerPath =
    "C/ProgramFiles/fileexplorer/fileSelectClient/gui.html";
  private readonly _args = ["--mode", "file_select"];

  public async Handle(process?: BaseProcess): Promise<number> {
    //TODO: Make this path not hardcoded

    if (!process) throw new Error("process not found");

    this._args.push(...["--pid", process.pid.toString()]);

    const pid = await new StartProcess({
      exePath: this._explorerPath,
      args: this._args.join(" "),
    }).Handle(process);

    return pid;
  }
}

export default SelectFile;
