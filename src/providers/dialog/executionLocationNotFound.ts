import { CreateElementFromString } from "@providers/gui/helpers";
import Prompt from "./prompt";

class ExecutionLocationNotFound extends Prompt {
  constructor() {
    super();

    this.SetHeader("Execution location not found");
    const errorMessageHTML = CreateElementFromString<HTMLSpanElement>(
      "<span>The execution location could not be found</span>"
    );

    this.SetBody(errorMessageHTML);

    this.Render();
    this.InitMovement();
    this.AllowPromptToBeClosed();
  }
}

export default ExecutionLocationNotFound;
