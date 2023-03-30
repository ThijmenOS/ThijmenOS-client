import NoPermissionDialog from "@providers/dialog/noPermission";

class NoPermission extends Error {
  constructor(message: string) {
    super(message);

    this.name = "NoAppForFiletypeError";

    new NoPermissionDialog();
  }
}

export default NoPermission;
