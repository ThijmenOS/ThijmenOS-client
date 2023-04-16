import { AddElement, CreateElementFromString } from "@providers/gui/helpers";
import { fatalError } from "../defaults";
import { OSErrors } from "../defaults/errors";

class FatalError extends Error {
  constructor(message: string, error: OSErrors) {
    super(message);

    this.name = "FatalError";

    const errorWindow = CreateElementFromString<HTMLDivElement>(
      fatalError(error)
    );

    AddElement(errorWindow);
  }
}

export default FatalError;
