import Prompt from "./prompt";
import { PermissionRequestDto, Permissions } from "@thijmen-os/common";
import {
  PromptFooterActions,
  promptFooters,
  promptSelectors,
} from "./defaults";
import { CreateElementFromString } from "@providers/gui/helpers";

class GrantPermission extends Prompt {
  promptCallback: (
    res: boolean,
    applicationDetails?: PermissionRequestDto
  ) => any;

  props: PermissionRequestDto;

  constructor(
    permission: Permissions,
    applicationId: string,
    applicationName: string,
    callback: (res: boolean, applicationDetails?: PermissionRequestDto) => any
  ) {
    super();

    this.props = { applicationId: applicationId, permission: permission };
    this.promptCallback = callback;

    this.SetHeader("Permission request");
    const bodyMessageHtml = CreateElementFromString<HTMLSpanElement>(
      `<span><p>The following application asks to use ${Permissions[permission]}</p><br><p>${applicationName}</p><br><p>Do you want to allow this?</p></span>`
    );

    this.SetBody(bodyMessageHtml);

    this.SetFooter(promptFooters.allowDenyFooter);

    this.promptElement.addEventListener("click", this.Onclick);

    this.Render();
    this.InitMovement();
  }

  private Onclick = (ev: Event) => this.Click(ev);
  private Click(ev: Event) {
    const target: HTMLDivElement = ev.target as HTMLDivElement;
    const hitButton: boolean = target.classList.contains(
      promptSelectors.promptButton
    );

    if (hitButton) {
      const action: PromptFooterActions = target.getAttribute(
        "data-action"
      ) as PromptFooterActions;

      if (action === PromptFooterActions.Allow) {
        this.promptCallback(true, this.props);
        this.Close();
      } else {
        this.promptCallback(false);
        this.Close();
      }
    }
  }
}

export default GrantPermission;
