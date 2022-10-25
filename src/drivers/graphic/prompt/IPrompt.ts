import { Location } from "@ostypes/LocationTypes";
import Prompt from "./Prompt";

export default interface IPrompt {
  Prompt(location: Location): Prompt;
  SelectApp(conteont: Array<string>, handler: (a: string) => void): void;
}
