/* <Class documentation>

  <Class description>
    The prompt class handles system prompts. When some application needs user input in the form of a choise or an notification, this class will handle it.

  <Method Description>
    Prompt(): Initialises the prompt.
    Close(): Removes the prompt from the DOM
    SelectApp(): This is a specific prompt.
      |_ this prompt is used by for example the appmanager to open a specific application that supports a mime type.

*/

//DI
import types from "@ostypes/types";
import { inject, injectable } from "inversify";

//Interfaces
import IPrompt from "./IPrompt";
import IGraphicsUtils from "../utils/IGraphicUtils";
import IUtils from "@utils/IUtils";

//Types
import { prompt, promptSelectors } from "@utils/dom-defaults";
import { Location } from "@ostypes/LocationTypes";

@injectable()
class Prompt implements IPrompt {
  private readonly _graphicsUtils: IGraphicsUtils;
  private readonly _utils: IUtils;

  private promptElement!: HTMLElement;
  private promptIdentifier?: string;

  constructor(
    @inject(types.GraphicsUtils) graphicsUtils: IGraphicsUtils,
    @inject(types.Utils) utils: IUtils
  ) {
    this._graphicsUtils = graphicsUtils;
    this._utils = utils;
  }

  private Close(): void {
    this.promptElement.remove();
  }
  private SetHeader(content: string) {
    this._graphicsUtils.GetElementByClass<HTMLSpanElement>(
      this.promptElement,
      promptSelectors.promptHeader
    ).innerHTML = content;
  }

  public Prompt(location: Location): Prompt {
    this.promptElement = this._graphicsUtils.CreateElementFromString(prompt);
    this.promptIdentifier = this._utils.GenerateUUID();
    this.promptElement.setAttribute("data-id", this.promptIdentifier);
    this.promptElement.setAttribute(
      "style",
      `left: ${location.left}; top: ${location.top}`
    );

    this._graphicsUtils.InitMovement(this.promptIdentifier);

    return this;
  }
  public SelectApp(content: Array<string>, handler: (a: string) => void): void {
    this.SetHeader("Select an app to open");

    const promptBody = this._graphicsUtils.GetElementByClass<HTMLDivElement>(
      this.promptElement,
      promptSelectors.promptBody
    );

    content.map((c) => {
      const constructedElement =
        this._graphicsUtils.CreateElementFromString<HTMLSpanElement>(
          `<span class="javascript-os-prompt-select-app-selectable-value-${c}">${c}</span>`
        );
      this._graphicsUtils.AddElement(promptBody, constructedElement);

      const appSelectionListElement =
        this._graphicsUtils.GetElementByClass<HTMLSpanElement>(
          promptBody,
          `javascript-os-prompt-select-app-selectable-value-${c}`
        );

      appSelectionListElement.onclick = () => {
        handler(c);
        this.Close();
      };
    });

    this._graphicsUtils.AddElement(
      this._graphicsUtils.MainAppContainer,
      this.promptElement
    );
  }
}

export default Prompt;
