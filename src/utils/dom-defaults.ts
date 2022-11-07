import { config } from "javascriptos-common/config";

export const fileIconSelectors = {
  fileIconSelector: "javascript-os-file-icon",
  fileIconFallbackSelector: "javascript-os-fallback-icon",
  fileIconTitle: "file-icon-title",
};
export const windowSelectors = {
  windowHeaderSelector: "javascript-os-header",
  windowOption: "javascript-os-window-option",
  windowTitle: "javascript-os-window-title",
  windowIcon: "javascript-os-window-icon",
  windowContent: "javascript-os-content",
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
export enum windowDataActions {
  Close = "close",
  Minimize = "minimize",
  Maximize = "maximize",
}

export const appIcon = `<div class="app javascript-os-file-icon-wrapper">
                <object class='app ${fileIconSelectors.fileIconSelector}' type="image/png">
                  <img class='app ${fileIconSelectors.fileIconFallbackSelector}' src='${config.host}/static/C/OperatingSystem/Icons/default-app-icon.svg'>
                </object>
                <p id='${fileIconSelectors.fileIconTitle}'></p>
              </div>
            `;

export const window = `<div id="inner-app-container" class="app-page inner-app-container">
              <div class="app-top-header ${windowSelectors.windowHeaderSelector}">
                <div class="app-options">
                  <div class="ball red ${windowSelectors.windowOption}" id="app-close" data-action="${windowDataActions.Close}"></div>
                  <div class="ball orange ${windowSelectors.windowOption}" id="app-smaller" data-action="${windowDataActions.Minimize}"></div>
                  <div class="ball green ${windowSelectors.windowOption}" id="app-bigger" data-action="${windowDataActions.Maximize}"></div>
                </div>
                <div class="${windowSelectors.windowTitle}"></div>
                <div class="${windowSelectors.windowIcon}"><div class="javascript-os-inner-icon"></div></div>
              </div>
              <div id="${windowSelectors.windowContent}" class="${windowSelectors.windowContent}">
              </div>
            </div>`;
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
