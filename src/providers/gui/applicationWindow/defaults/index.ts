export const windowSelectors = {
  windowHeaderSelector: "javascript-os-header",
  windowOption: "javascript-os-window-option",
  windowTitle: "javascript-os-window-title",
  windowIcon: "javascript-os-window-icon",
  windowContent: "javascript-os-content",
};

export enum WindowDataActions {
  Close = "close",
  Minimize = "minimize",
  Maximize = "maximize",
}

export const window = `<div id="inner-app-container" class="app-page inner-app-container">
              <div class="app-top-header ${windowSelectors.windowHeaderSelector}">
                <div class="app-options">
                  <div class="ball red ${windowSelectors.windowOption}" id="app-close" data-action="${WindowDataActions.Close}"></div>
                  <div class="ball orange ${windowSelectors.windowOption}" id="app-smaller" data-action="${WindowDataActions.Minimize}"></div>
                  <div class="ball green ${windowSelectors.windowOption}" id="app-bigger" data-action="${WindowDataActions.Maximize}"></div>
                </div>
                <div class="${windowSelectors.windowTitle}"></div>
                <div class="${windowSelectors.windowIcon}"><div class="javascript-os-inner-icon"></div></div>
              </div>
              <div id="${windowSelectors.windowContent}" class="${windowSelectors.windowContent}">
              </div>
            </div>`;
