import CreateWindow from "@app/window/CreateWindow";
import FileSystem from "@core/fileSystem";
import RootUtils from "@core/rootUtils.js";
import Settings from "@core/settings";

class Core {
  public fileSystem: FileSystem;
  public appRegistry: CreateWindow;
  public settings: Settings;
  public rootUtils: RootUtils;

  constructor() {
    this.fileSystem = new FileSystem();
    this.appRegistry = new CreateWindow();
    this.settings = new Settings();
    this.rootUtils = new RootUtils();
  }
}

export default Core;
