import { AddElement, CreateElementFromString } from "@providers/gui/helpers";
import { fatalError } from "../defaults";

function FatalError() {
  const errorWindow = CreateElementFromString<HTMLDivElement>(fatalError);

  AddElement(errorWindow);

  throw new Error("Fatal error");
}

export default FatalError;
