class AppBuilder {
  static async BuildApp(appPath, appName) {
    let htmlText = await fetch(appPath).then((res) => res.text());
    var parser = new DOMParser();
    var el = parser.parseFromString(htmlText, "text/html");

    let css = el.getElementsByTagName("link");
    Array.from(css).forEach(async (css) => {
      if (
        css.hasAttribute("href") &&
        new URL(css.href).host === "thijmenbrand.nl"
      ) {
        let cssHref = this.#GetCorrectUrl(appPath, css.href);
        let fileText = await fetch(cssHref).then((res) => res.text());
        css.remove();
        let newStyle = document.createElement("style");
        newStyle.innerHTML = fileText;
        el.head.appendChild(newStyle);
      }
    });

    let js = el.getElementsByTagName("script");
    Array.from(js).forEach(async (js) => {
      if (
        js.hasAttribute("src") &&
        new URL(js.src).host === "thijmenbrand.nl"
      ) {
        let jsHref = this.#GetCorrectUrl(appPath, js.src);
        let fileText = await fetch(jsHref).then((res) => res.text());
        js.remove();
        let newScript = document.createElement("script");
        newScript.innerHTML = fileText;
        el.body.after(newScript);
      }
    });

    let img = el.getElementsByTagName("img");
    Array.from(img).forEach(async (img) => {
      if (
        img.hasAttribute("src") &&
        new URL(img.src).host === "thijmenbrand.nl"
      ) {
        let imgHref = this.#GetCorrectUrl(appPath, img.src);
        let base64Image = await this.#toDataURL(imgHref);

        img.src = base64Image;
      }
    });

    let defaultScript = await fetch(
      "https://thijmenbrand.nl/projects/website/desktop-website/js/userAvailable/operatingSystem.js"
    ).then((res) => res.text());
    let newScript = document.createElement("script");
    newScript.setAttribute("data-app-script", appName);
    newScript.id = "os-script";
    newScript.innerHTML = defaultScript;
    el.body.after(newScript);

    setTimeout(() => console.log(el.documentElement.innerHTML), 5000);
  }
  static #toDataURL = (url) =>
    fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );
  static #GetCorrectUrl(appPath, filePath) {
    if (new URL(filePath).host !== "thijmenbrand.nl") return;
    appPath = appPath.split("/");
    appPath.pop();
    filePath = filePath.split("/");
    filePath.splice(5, 0, ...appPath);
    // eslint-disable-next-line consistent-return
    return filePath.join("/");
  }
}
