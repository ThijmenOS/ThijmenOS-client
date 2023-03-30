import ApplicationNotFound from "@providers/dialog/applicationNotFound";

class ProcessAlreadyRunning extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProcessAlreadyRunning";

    new ApplicationNotFound();
  }
}

export default ProcessAlreadyRunning;
