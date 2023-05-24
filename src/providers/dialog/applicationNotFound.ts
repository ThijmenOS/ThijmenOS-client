import { CreateElementFromString } from "@providers/gui/helpers";
import Prompt from "./prompt";

class ApplicationNotFound extends Prompt {
  constructor() {
    super();

    this.SetHeader("Application not found");
    const errorMessageHTML = CreateElementFromString<HTMLSpanElement>(
      "<span>The application could not be found and there for not be executed!</span>"
    );

    this.SetBody(errorMessageHTML);

    this.Render();
    this.InitMovement();
    this.AllowPromptToBeClosed();
  }
}

export default ApplicationNotFound;
