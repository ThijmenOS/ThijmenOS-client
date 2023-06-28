import { errors } from "@core/kernel/commands/errors";
import Exit from "@providers/error/systemErrors/Exit";

class MemAllocNotFound extends Exit {
  constructor() {
    super(errors.MemoryAllocationDoesNotExist, "MEMORY_KEY_NOT_FOUND");
  }
}

export default MemAllocNotFound;
