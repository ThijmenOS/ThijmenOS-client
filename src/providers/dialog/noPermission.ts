import { CreateElementFromString } from "@providers/gui/helpers";
import Prompt from "./prompt";

class NoPermissionDialog extends Prompt {
  constructor() {
    super();

    this.SetHeader("Permission denied");
    const errorMessageHTML = CreateElementFromString<HTMLSpanElement>(
      "<p>You do not have permission to access this resource</p>"
    );

    this.SetBody(errorMessageHTML);

    this.Render();
    this.InitMovement();
    this.AllowPromptToBeClosed();
  }
}

export default NoPermissionDialog;
