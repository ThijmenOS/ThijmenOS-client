import { errors } from "@core/kernel/commands/errors";
import Exit from "@providers/error/systemErrors/Exit";

class NoMemWWriteAccess extends Exit {
  constructor() {
    super(
      errors.NoWriteAccessToMemoryAddress,
      "NO_WRITE_ACCESS_TO_MEMORY_ALLOCATION"
    );
  }
}

export default NoMemWWriteAccess;
