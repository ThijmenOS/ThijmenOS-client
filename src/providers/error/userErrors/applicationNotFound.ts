import ApplicationNotFound from "@providers/dialog/applicationNotFound";

class ApplicationNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApplicationNotFound";

    new ApplicationNotFound();
  }
}

export default ApplicationNotFoundError;
