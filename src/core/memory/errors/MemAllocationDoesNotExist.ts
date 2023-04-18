import Exit from "@providers/error/systemErrors/Exit";

class MemAllocationDoesNotExist extends Exit {
  constructor() {
    super(1, "Mem_Allocation_Does_Not_Exist");
  }
}

export default MemAllocationDoesNotExist;
