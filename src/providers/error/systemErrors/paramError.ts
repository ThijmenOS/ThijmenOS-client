import Exit from "./Exit";

class ParameterError extends Exit {
  constructor() {
    super(1000, "Incorrect_Parameters_For_Sys_Call");
  }
}

export default ParameterError;
