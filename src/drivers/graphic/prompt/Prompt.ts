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
import { injectable } from "inversify";

//Interfaces
import IPrompt from "./IPrompt";
import { GenerateUUID } from "@thijmenos/utils";

//Types
import { prompt, promptSelectors } from "@utils/dom-defaults";
import {
  AddElement,
  CreateElementFromString,
  GetElementByClass,
  InitMovement,
} from "@thijmenos/graphics";

@injectable()
class Prompt implements IPrompt {
  private promptElement!: HTMLElement;
  private promptBody!: HTMLDivElement;
  private promptIdentifier!: string;

  private Close(): void {
    this.promptElement.remove();

    window.removeEventListener("click", this.click);
  }

  private SetHeader(headerContent: string, subHeaderContent?: string) {
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

  private SetBody(content: HTMLElement): void {
    this.promptBody = GetElementByClass<HTMLDivElement>(
      this.promptElement,
      promptSelectors.promptBody
    );

    AddElement(content, this.promptBody);
  }

  private Render(): void {
    AddElement(this.promptElement);
  }

  private InitMovement() {
    InitMovement(this.promptIdentifier);
  }

  private click = (ev: MouseEvent) => this.CloseByClickOutside(ev);

  private AllowOutsideClickToClose() {
    window.addEventListener("click", this.click);
  }

  private AllowPromptToBeClosed() {
    const closePrompt = GetElementByClass<HTMLDivElement>(
      this.promptElement,
      promptSelectors.closePrompt
    );

    closePrompt.addEventListener("click", () => this.Close());
  }

  private CloseByClickOutside(ev: MouseEvent) {
    if (!ev.composedPath().includes(this.promptElement)) {
      this.Close();
    }
  }

  public Prompt(): Prompt {
    this.promptElement = CreateElementFromString(prompt);
    this.promptIdentifier = GenerateUUID();
    this.promptElement.setAttribute("data-id", this.promptIdentifier);

    return this;
  }

  public SelectApp(content: Array<string>, handler: (a: string) => void): void {
    this.SetHeader("No default app", "Select an app to open this file with");

    content.map((c) => {
      const constructedElement = CreateElementFromString<HTMLSpanElement>(
        `<span class="javascript-os-prompt-select-app-selectable-value-${c} javascript-os-prompt-option">${c}</span>`
      );
      this.SetBody(constructedElement);

      const appSelectionListElement = GetElementByClass<HTMLSpanElement>(
        this.promptBody,
        `javascript-os-prompt-select-app-selectable-value-${c}`
      );

      appSelectionListElement.onclick = () => {
        handler(c);
        this.Close();
      };
    });

    this.Render();
    this.AllowOutsideClickToClose();
    this.AllowPromptToBeClosed();
  }

  public NoAppForFileType(): void {
    this.SetHeader("File type not supported");
    const errorMessageHTML = CreateElementFromString<HTMLSpanElement>(
      "<p>There is no application found that supports this file type!</p>"
    );

    this.SetBody(errorMessageHTML);

    this.Render();
    this.InitMovement();
    this.AllowPromptToBeClosed();
  }

  public ApplicationNotFound(): void {
    this.SetHeader("Application not found");
    const errorMessageHTML = CreateElementFromString<HTMLSpanElement>(
      "<span>The application could not be found and there for not be executed!</span>"
    );

    this.SetBody(errorMessageHTML);

    this.Render();
    this.InitMovement();
    this.AllowPromptToBeClosed();
  }
}

export default Prompt;
