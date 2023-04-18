import Exit from "@providers/error/systemErrors/Exit";

class NoReadAccessToMemAllocation extends Exit {
  constructor() {
    super(4, "No_Read_Access_To_Memory_Allocation");
  }
}

export default NoReadAccessToMemAllocation;
