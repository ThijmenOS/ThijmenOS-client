import { ErrorExit } from "@providers/error/systemErrors/systemError";

class MemAllocationDoesNotExist extends ErrorExit {
  constructor() {
    super(
      1,
      "Mem_Allocation_Does_Not_Exist",
      "The memory allocation does not exist."
    );
  }
}

export default MemAllocationDoesNotExist;
