import { CreateElementFromString } from "@providers/gui/helpers";
import Prompt from "./prompt";

class ProcessAlreadyRunning extends Prompt {
  constructor() {
    super();

    this.SetHeader("The process is aready running");
    const errorMessageHTML = CreateElementFromString<HTMLSpanElement>(
      "<span>There desired process is already running somewhere on the system. see task manager for more information</span>"
    );

    this.SetBody(errorMessageHTML);

    this.Render();
    this.InitMovement();
    this.AllowPromptToBeClosed();
  }
}

export default ProcessAlreadyRunning;
