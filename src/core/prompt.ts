import types from "@interface/types";
import { IUtils } from "@interface/utils/utils";
import { inject, injectable } from "inversify";
import { prompt } from "@static/dom-defaults";
import { IPrompt } from "@interface/prompt/prompt";

@injectable()
class Prompt implements IPrompt {
  private readonly _utils: IUtils;

  private promptElement!: HTMLElement;

  constructor(@inject(types.Utils) utils: IUtils) {
    this._utils = utils;
  }
  public Prompt(): Prompt {
    this.promptElement = this._utils.CreateElementFromHTML(prompt);

    return this;
  }
  private Close(): void {
    this.promptElement.remove();
  }

  public SelectApp(content: Array<string>, handler: (a: string) => void): void {
    this._utils.GetElement<HTMLSpanElement>(
      this.promptElement,
      ".javascript-os-prompt-header"
    ).innerHTML = "Select an app to open";

    const promptBody = this._utils.GetElement<HTMLDivElement>(
      this.promptElement,
      ".javascript-os-prompt-body"
    );

    content.map((c) => {
      const constructedElement =
        this._utils.CreateElementFromHTML<HTMLSpanElement>(
          `<span class="javascript-os-prompt-select-app-selectable-value-${c}">${c}</span>`
        );
      this._utils.AddElement(promptBody, constructedElement);

      const appSelectionListElement = this._utils.GetElement<HTMLSpanElement>(
        promptBody,
        `.javascript-os-prompt-select-app-selectable-value-${c}`
      );

      appSelectionListElement.onclick = () => {
        handler(c);
        this.Close();
      };
    });

    this._utils.AddElement(this._utils.MainAppContainer, this.promptElement);
  }
}

export default Prompt;
