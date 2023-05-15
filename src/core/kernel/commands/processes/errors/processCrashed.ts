import Exit from "@providers/error/systemErrors/Exit";

class ProcessCrashed extends Exit {
  constructor() {
    super(6, "Process_Crashed");
  }
}

export default ProcessCrashed;
