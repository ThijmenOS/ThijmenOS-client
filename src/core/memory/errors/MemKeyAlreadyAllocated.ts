import Exit from "@providers/error/systemErrors/Exit";

class MemKeyAlreadyAllocated extends Exit {
  constructor() {
    super(
      2,
      "Mem_Key_Already_Allocated",
      "Memory key is already allocated and cannot be overwritten"
    );
  }
}

export default MemKeyAlreadyAllocated;
