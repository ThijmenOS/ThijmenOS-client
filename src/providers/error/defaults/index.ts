export const fatalError = (
  errorId: number
) => `<div class='fatal-blue-screen-error'>
              <span class='errorMessageContainer'>
                <span class='errorEmoji'>╚(•⌂•)╝</span>
                <span class='error-header'>A fatal error occured</span>
                <span class='error-body'>Error code: #${errorId}</span>
              </span>
            </div>`;
