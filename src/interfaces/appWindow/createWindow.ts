import FileIcon from "@app/file-icon/fileIcon";
import AppWindow from "@app/window/appWindow";

export interface ICreateWindow {
  Application(fileIcon: FileIcon): any;
  InitWindow(): AppWindow;
}
