import Exit from "@providers/error/systemErrors/Exit";

class MemAllocationDoesNotExist extends Exit {
  constructor() {
    super(
      1,
      "Mem_Allocation_Does_Not_Exist",
      "The memory allocation does not exist."
    );
  }
}

export default MemAllocationDoesNotExist;
