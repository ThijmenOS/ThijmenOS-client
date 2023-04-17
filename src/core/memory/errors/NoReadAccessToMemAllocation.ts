import Exit from "@providers/error/systemErrors/Exit";

class NoReadAccessToMemAllocation extends Exit {
  constructor() {
    super(
      4,
      "No_Read_Access_To_Memory_Allocation",
      "No Read Access To the targeted memory allocation"
    );
  }
}

export default NoReadAccessToMemAllocation;
