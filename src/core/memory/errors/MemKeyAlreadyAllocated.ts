import { ErrorExit } from "@providers/error/systemErrors/systemError";

class MemKeyAlreadyAllocated extends ErrorExit {
  constructor() {
    super(
      2,
      "Mem_Key_Already_Allocated",
      "Memory key is already allocated and cannot be overwritten"
    );
  }
}

export default MemKeyAlreadyAllocated;
