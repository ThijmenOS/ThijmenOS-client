import { ErrorExit } from "@providers/error/systemErrors/systemError";

class NoWriteAccessToMemAllocation extends ErrorExit {
  constructor() {
    super(
      3,
      "No_Write_Access_To_Memory_Allocation",
      "No Write Access To the targeted memory allocation"
    );
  }
}

export default NoWriteAccessToMemAllocation;
