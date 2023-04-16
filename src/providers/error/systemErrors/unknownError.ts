import { ErrorExit } from "./systemError";

class UnknownError extends ErrorExit {
  constructor() {
    super(1001, "Unknown_Error", "An Unknown error has occured");
  }
}

export default UnknownError;
