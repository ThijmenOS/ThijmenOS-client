import ApplicationNotFound from "@providers/dialog/applicationNotFound";

class CouldNotStartProcess extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CouldNotStartProcess";
  }
}

export default CouldNotStartProcess;
