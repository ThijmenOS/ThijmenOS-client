import ExecutionLocationNotFound from "@providers/dialog/executionLocationNotFound";

class ExectutionLocationNotFound extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApplicationNotFound";

    new ExecutionLocationNotFound();
  }
}

export default ExectutionLocationNotFound;
