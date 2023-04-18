import Exit from "@providers/error/systemErrors/Exit";

class NoWriteAccessToMemAllocation extends Exit {
  constructor() {
    super(
      3,
      "No_Write_Access_To_Memory_Allocation",
      "No Write Access To the targeted memory allocation"
    );
  }
}

export default NoWriteAccessToMemAllocation;
