import Exit from "./Exit";

class ParameterError extends Exit {
  constructor(sysCall: string) {
    super(
      1000,
      "Incorrect_Parameters_For_Sys_Call",
      `Incorrect parameters where proveded for system call: ${sysCall}`
    );
  }
}

export default ParameterError;
