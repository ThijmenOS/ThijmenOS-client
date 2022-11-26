import ICore from "@core/core/ICore";
import { ICommand } from "@ostypes/CommandTypes";
import javascriptOs from "@inversify/inversify.config";
import types from "@ostypes/types";
import { Path } from "@thijmen-os/common";

class ChangeBackgroundCommand implements ICommand {
  private readonly _core: ICore = javascriptOs.get<ICore>(types.Core);
  private readonly props: Path;

  constructor(props: Path) {
    this.props = props;
  }

  Handle(): void {
    this._core.settings.Background().Change(this.props);
  }
}

export default ChangeBackgroundCommand;
