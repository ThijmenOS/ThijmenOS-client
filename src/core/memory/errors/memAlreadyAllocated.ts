import { errors } from "@core/kernel/commands/errors";
import Exit from "@providers/error/systemErrors/Exit";

class MemoryAlreadyAllocated extends Exit {
  constructor() {
    super(errors.MemoryAlreadyAllocated, "Memory_Key_Is_Already_Allocated");
  }
}

export default MemoryAlreadyAllocated;
