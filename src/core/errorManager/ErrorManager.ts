/* <Class Documentation>

  <Class Description>
    The ErrorManager class is to correctly handle errors that occure within the operating system. When there are errors in other classes and methods they will class this class to handle it correctly with a message and worst case a blue screen

  <Error Codes>
    #00001: Settings could not be loaded
*/

//DI
import Prompt from "@thijmenos/prompt";
import { fatalError } from "@utils/dom-defaults";
import { injectable } from "inversify";

//Interfaces
import IErrorManager from "./IErrorManager";
import { CreateElementFromString, AddElement } from "@thijmenos/graphics";

@injectable()
class ErrorManager implements IErrorManager {
  public RaiseError(): ErrorManager {
    return this;
  }

  public ApplicationNotFound() {
    new Prompt.applicationNotFound();

    throw new Error("The application could not be found!");
  }

  public FatalError(): void {
    const errorWindow = CreateElementFromString<HTMLDivElement>(fatalError);

    AddElement(errorWindow);

    throw new Error("Fatal error");
  }

  public FileTypeNotSupportedError() {
    new Prompt.noAppForFiletype();
  }
}

export default ErrorManager;
