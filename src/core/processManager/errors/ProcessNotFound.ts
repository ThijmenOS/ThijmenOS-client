import Exit from "@providers/error/systemErrors/Exit";

class ProcessNotFound extends Exit {
  constructor() {
    super(7, "Process_Not_Found");
  }
}

export default ProcessNotFound;
