import Prompt from "@core/prompt";

export interface IPrompt {
  Prompt(): Prompt;
  SelectApp(conteont: Array<string>, handler: (a: string) => void): void;
}
