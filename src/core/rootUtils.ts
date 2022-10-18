import AppWindow, { windows } from "../app-regestry/window/appWindow.js";
import Utils from "@utils/utils.js";

class RootUtils {
  closeWindow(targetWindow: string) {
    let targetWin = windows.find(
      (window: AppWindow): boolean =>
        window.windowOptions.windowTitle == targetWindow
    );

    if (targetWin) targetWin.Destroy();
  }
  public async SendDataToApp(
    app: string,
    data: string | object,
    sender: string
  ) {
    if (!sender || !app) throw new Error("No app or sender specified!");
    let content = {
      sender: sender,
      return: data,
    };

    Utils.waitForElm(app).then((res: any) => {
      setTimeout(() => {
        res.contentWindow.postMessage(content, "*");
      }, 200);
    });
  }
}

export default RootUtils;
