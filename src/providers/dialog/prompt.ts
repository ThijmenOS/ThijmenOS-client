import {
  CreateElementFromString,
  GetElementByClass,
  AddElement,
  InitMovement,
} from "@providers/gui/helpers";
import { promptSelectors, prompt } from "./defaults";
import GenerateUUID from "@utils/generateUUID";

class Prompt {
  protected promptElement!: HTMLElement;
  protected promptBody!: HTMLDivElement;
  protected promptIdentifier!: string;

  constructor() {
    this.promptElement = CreateElementFromString(prompt);
    this.promptIdentifier = GenerateUUID();
    this.promptElement.setAttribute("data-id", this.promptIdentifier);
  }

  protected Close(): void {
    this.promptElement.remove();
  }

  protected SetHeader(headerContent: string, subHeaderContent?: string) {
    GetElementByClass<HTMLSpanElement>(
      this.promptElement,
      promptSelectors.promptHeader
    ).innerHTML = headerContent;

    if (subHeaderContent)
      GetElementByClass<HTMLSpanElement>(
        this.promptElement,
        promptSelectors.promptSubHeader
      ).innerHTML = subHeaderContent;
  }

  protected SetBody(content: HTMLElement): void {
    this.promptBody = GetElementByClass<HTMLDivElement>(
      this.promptElement,
      promptSelectors.promptBody
    );

    AddElement(content, this.promptBody);
  }

  protected SetFooter(content: string) {
    const footerElement = GetElementByClass<HTMLSpanElement>(
      this.promptElement,
      promptSelectors.promptFooter
    );

    AddElement(
      CreateElementFromString<HTMLSpanElement>(content),
      footerElement
    );
  }

  protected Render(): void {
    AddElement(this.promptElement);
  }

  protected InitMovement() {
    InitMovement(this.promptIdentifier);
  }

  protected AllowPromptToBeClosed() {
    const closePrompt = GetElementByClass<HTMLDivElement>(
      this.promptElement,
      promptSelectors.closePrompt
    );

    closePrompt.addEventListener("click", () => this.Close());
  }
}

export default Prompt;
