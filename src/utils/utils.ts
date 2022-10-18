import FileSystem from "@core/fileSystem";

class Utils {
  static createElementFromHTML(htmlString: string): HTMLDivElement {
    var div = document.createElement("div");
    div.innerHTML = htmlString.trim();

    return div.firstChild as HTMLDivElement;
  }
  static updateTime() {
    let currentDate = new Date();
    let currentTime = currentDate.getHours() + ":" + currentDate.getMinutes();
    $("#current-date-time").text(
      currentDate.toDateString() + " " + currentTime
    );
  }
  static generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      let random = (Math.random() * 16) | 0;
      let value = char === "x" ? random : (random % 4) + 8;
      return value.toString(16);
    });
  }
  static async getAppProperties(appLocation: string): Promise<Array<string>> {
    let fs = new FileSystem();
    let appCode = await fs.openFile(appLocation);
    let tmp = document.createElement("html") as HTMLElement;
    tmp.innerHTML = appCode;

    let appTitle: string = tmp
      .querySelector("meta[name='title']")
      ?.getAttribute("content") as string;
    let appIcon: string = tmp
      .querySelector("meta[name='icon']")
      ?.getAttribute("content") as string;

    return [appTitle, appIcon];
  }
  static waitForElm(selector: string) {
    return new Promise((resolve) => {
      if (document.getElementById(selector)) {
        return resolve(document.getElementById(selector));
      }

      const observer = new MutationObserver(() => {
        if (document.getElementById(selector)) {
          resolve(document.getElementById(selector));
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }
}

export default Utils;
