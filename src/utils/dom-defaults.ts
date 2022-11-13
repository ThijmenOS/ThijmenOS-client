import { host } from "@thijmenos/common";

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

export const fatalError = `<div class='fatal-blue-screen-error'>
              <span class='errorMessageContainer'>
                <span class='errorEmoji'>╚(•⌂•)╝</span>
                <span class='error-header'>A fatal error occured</span>
                <span class='error-body'>Error code: #00001</span>
              </span>
            </div>`;
