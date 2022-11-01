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
  private promptBody!: HTMLDivElement;
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
  private SetBody(content: HTMLElement): void {
    this.promptBody = this._graphicsUtils.GetElementByClass<HTMLDivElement>(
      this.promptElement,
      promptSelectors.promptBody
    );

    this._graphicsUtils.AddElement(content, this.promptBody);
  }
  private Render(): void {
    this._graphicsUtils.AddElement(this.promptElement);
  }

  public Prompt(location?: Location): Prompt {
    this.promptElement = this._graphicsUtils.CreateElementFromString(prompt);
    this.promptIdentifier = this._utils.GenerateUUID();
    this.promptElement.setAttribute("data-id", this.promptIdentifier);
    if (location)
      this.promptElement.setAttribute(
        "style",
        `left: ${location.left};
        top: ${location.top}`
      );

    this._graphicsUtils.InitMovement(this.promptIdentifier);

    return this;
  }

  public SelectApp(content: Array<string>, handler: (a: string) => void): void {
    this.SetHeader("Select an app to open");

    content.map((c) => {
      const constructedElement =
        this._graphicsUtils.CreateElementFromString<HTMLSpanElement>(
          `<span class="javascript-os-prompt-select-app-selectable-value-${c}">${c}</span>`
        );
      this.SetBody(constructedElement);

      const appSelectionListElement =
        this._graphicsUtils.GetElementByClass<HTMLSpanElement>(
          this.promptBody,
          `javascript-os-prompt-select-app-selectable-value-${c}`
        );

      appSelectionListElement.onclick = () => {
        handler(c);
        this.Close();
      };
    });

    this.Render();
  }

  public NoAppForFileType(): void {
    this.SetHeader("File type not supported");
    const errorMessageHTML =
      this._graphicsUtils.CreateElementFromString<HTMLSpanElement>(
        "<p>There is no application found that supports this file type!</p>"
      );

    this.SetBody(errorMessageHTML);

    this.Render();
  }
}

export default Prompt;
