import { host } from "@thijmenos/common";

export const fileIconSelectors = {
  fileIconSelector: "javascript-os-file-icon",
  fileIconFallbackSelector: "javascript-os-fallback-icon",
  fileIconTitle: "file-icon-title",
};

export const promptSelectors = {
  promptMessage: "javascript-os-prompt-message",
  closePrompt: "javascript-os-prompt-close",
  promptHeaderContainer: "javascript-os-prompt-header-container",
  promptHeader: "javascript-os-prompt-header",
  promptSubHeader: "javascript-os-prompt-sub-header",
  promptBody: "javascript-os-prompt-body",
  promptFooter: "javascript-os-prompt-footer",
};

export const appIcon = `<div class="app javascript-os-file-icon-wrapper">
                <object class='app ${fileIconSelectors.fileIconSelector}' type="image/png">
                  <img class='app ${fileIconSelectors.fileIconFallbackSelector}' src='${host}/static/C/OperatingSystem/Icons/default-app-icon.svg'>
                </object>
                <p id='${fileIconSelectors.fileIconTitle}'></p>
              </div>
            `;

export const prompt = `<div class="${promptSelectors.promptMessage}">
              <span>
                <div class="ball red ${promptSelectors.closePrompt}"></div>
              </span>
              <span class="${promptSelectors.promptHeaderContainer}">
              <h3 class="${promptSelectors.promptHeader}"></h3>
              <p class="${promptSelectors.promptSubHeader}"></p>
              </span>
              <div class="${promptSelectors.promptBody}"></div>
              <span class="${promptSelectors.promptFooter}"></span>
            </div>`;
export const fatalError = `<div class='fatal-blue-screen-error'>
              <span class='errorMessageContainer'>
                <span class='errorEmoji'>╚(•⌂•)╝</span>
                <span class='error-header'>A fatal error occured</span>
                <span class='error-body'>Error code: #00001</span>
              </span>
            </div>`;
