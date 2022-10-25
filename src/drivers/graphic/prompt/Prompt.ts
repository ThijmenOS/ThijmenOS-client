import types from "@ostypes/types";
import { inject, injectable } from "inversify";
import { prompt, promptSelectors } from "@utils/dom-defaults";
import IPrompt from "./IPrompt";
import IGraphicsUtils from "../utils/IGraphicUtils";
import IUtils from "@utils/IUtils";
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
  public Prompt(location: Location): Prompt {
    this.promptElement = this._graphicsUtils.CreateElementFromHTML(prompt);
    this.promptIdentifier = this._utils.GenerateUUID();
    this.promptElement.setAttribute("data-id", this.promptIdentifier);
    this.promptElement.setAttribute(
      "style",
      `left: ${location.left}; top: ${location.top}`
    );

    this._graphicsUtils.InitMovement(this.promptIdentifier);

    return this;
  }
  private Close(): void {
    this.promptElement.remove();
  }

  public SelectApp(content: Array<string>, handler: (a: string) => void): void {
    this.SetHeader("Select an app to open");

    const promptBody = this._graphicsUtils.GetElementByClass<HTMLDivElement>(
      this.promptElement,
      promptSelectors.promptBody
    );

    content.map((c) => {
      const constructedElement =
        this._graphicsUtils.CreateElementFromHTML<HTMLSpanElement>(
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
  private SetHeader(content: string) {
    this._graphicsUtils.GetElementByClass<HTMLSpanElement>(
      this.promptElement,
      promptSelectors.promptHeader
    ).innerHTML = content;
  }
}

export default Prompt;
