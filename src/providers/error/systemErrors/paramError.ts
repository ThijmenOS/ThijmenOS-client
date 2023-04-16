import { ErrorExit } from "./systemError";

class ParameterError extends ErrorExit {
  constructor(sysCall: string) {
    super(
      1000,
      "Incorrect_Parameters_For_Sys_Call",
      `Incorrect parameters where proveded for system call: ${sysCall}`
    );
  }
}

export default ParameterError;
