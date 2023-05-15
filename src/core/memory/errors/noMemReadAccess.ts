import { errors } from "@core/kernel/commands/errors";
import Exit from "@providers/error/systemErrors/Exit";

class NoMemReadAccess extends Exit {
  constructor() {
    super(
      errors.NoWriteAccessToMemoryAddress,
      "No_READ_ACCESS_TO_MEMORY_ALLOCATION"
    );
  }
}

export default NoMemReadAccess;
