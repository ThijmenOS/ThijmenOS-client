import { host } from "@thijmen-os/common";

export const fileIconSelectors = {
  fileIconSelector: "javascript-os-file-icon",
  fileIconFallbackSelector: "javascript-os-fallback-icon",
  fileIconTitle: "file-icon-title",
};

export const appIcon = `<div class="app javascript-os-file-icon-wrapper">
                <object class='app ${fileIconSelectors.fileIconSelector}' type="image/png">
                  <img class='app ${fileIconSelectors.fileIconFallbackSelector}' src='${host}/static/C/OperatingSystem/Icons/default-app-icon.svg'>
                </object>
                <p id='${fileIconSelectors.fileIconTitle}'></p>
              </div>
            `;
