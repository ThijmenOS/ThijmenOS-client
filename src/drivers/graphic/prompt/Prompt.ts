import types from "@ostypes/types";
import { inject, injectable } from "inversify";
import { prompt, promptSelectors } from "@utils/dom-defaults";
import IPrompt from "./IPrompt";
import IGraphicsUtils from "../utils/IGraphicUtils";

@injectable()
class Prompt implements IPrompt {
  private readonly _graphicsUtils: IGraphicsUtils;

  private promptElement!: HTMLElement;

  constructor(@inject(types.GraphicsUtils) graphicsUtils: IGraphicsUtils) {
    this._graphicsUtils = graphicsUtils;
  }
  public Prompt(): Prompt {
    this.promptElement = this._graphicsUtils.CreateElementFromHTML(prompt);

    return this;
  }
  private Close(): void {
    this.promptElement.remove();
  }

  public SelectApp(content: Array<string>, handler: (a: string) => void): void {
    this._graphicsUtils.GetElementByClass<HTMLSpanElement>(
      this.promptElement,
      promptSelectors.promptHeader
    ).innerHTML = "Select an app to open";

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
}

export default Prompt;
