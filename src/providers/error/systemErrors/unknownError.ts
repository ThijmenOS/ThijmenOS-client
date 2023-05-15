import Exit from "./Exit";

class UnknownError extends Exit {
  constructor() {
    super(1001, "Unknown_Error");
  }
}

export default UnknownError;
