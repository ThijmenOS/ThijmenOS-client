import { errors } from "@core/kernel/commands/errors";
import Exit from "@providers/error/systemErrors/Exit";

class MemAllocNotFound extends Exit {
  constructor() {
    super(errors.MemoryAllocationDoesNotExist, "Memory_Allocation_Not_Found");
  }
}

export default MemAllocNotFound;
