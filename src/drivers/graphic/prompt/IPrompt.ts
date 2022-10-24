import Prompt from "./Prompt";

export default interface IPrompt {
  Prompt(): Prompt;
  SelectApp(conteont: Array<string>, handler: (a: string) => void): void;
}
