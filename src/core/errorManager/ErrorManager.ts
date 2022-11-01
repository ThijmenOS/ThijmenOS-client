/* <Class Documentation>

  <Class Description>
    The ErrorManager class is to correctly handle errors that occure within the operating system. When there are errors in other classes and methods they will class this class to handle it correctly with a message and worst case a blue screen

  <Error Codes>
    #00001: Settings could not be loaded
*/

//DI
import IPrompt from "@drivers/graphic/prompt/IPrompt";
import IGraphicsUtils from "@drivers/graphic/utils/IGraphicUtils";
import types from "@ostypes/types";
import { fatalError } from "@utils/dom-defaults";
import { inject, injectable } from "inversify";
import javascriptOs from "../../../inversify.config";

//Interfaces
import IErrorManager from "./IErrorManager";

@injectable()
class ErrorManager implements IErrorManager {
  private readonly _graphicUtils: IGraphicsUtils;

  constructor(@inject(types.GraphicsUtils) graphicUtils: IGraphicsUtils) {
    this._graphicUtils = graphicUtils;
  }

  public RaiseError(error: string) {
    throw new Error(error);
  }
  public FatalError(): void {
    const errorWindow =
      this._graphicUtils.CreateElementFromString<HTMLDivElement>(fatalError);

    this._graphicUtils.AddElement(errorWindow);

    throw new Error("Fatal error");
  }
  public FileTypeNotSupportedError() {
    javascriptOs.get<IPrompt>(types.Prompt).Prompt().NoAppForFileType();
  }
}

export default ErrorManager;
