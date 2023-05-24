import { CreateElementFromString } from "@providers/gui/helpers";
import Prompt from "./prompt";

class NoAppForFiletype extends Prompt {
  constructor() {
    super();

    this.SetHeader("File type not supported");
    const errorMessageHTML = CreateElementFromString<HTMLSpanElement>(
      "<p>There is no application found that supports this file type!</p>"
    );

    this.SetBody(errorMessageHTML);

    this.Render();
    this.InitMovement();
    this.AllowPromptToBeClosed();
  }
}

export default NoAppForFiletype;
