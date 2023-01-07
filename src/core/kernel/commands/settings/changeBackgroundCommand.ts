import { ICommand } from "@ostypes/CommandTypes";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { Path } from "@thijmen-os/common";
import Settings from "@core/settings/settingsMethodShape";

class ChangeBackgroundCommand implements ICommand {
  private readonly _settings: Settings = javascriptOs.get<Settings>(
    types.Settings
  );
  private readonly props: Path;

  constructor(props: Path) {
    this.props = props;
  }

  Handle(): void {
    this._settings.Background().Change(this.props);
  }
}

export default ChangeBackgroundCommand;
