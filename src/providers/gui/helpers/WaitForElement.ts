export function WaitForElm<T>(selector: string): Promise<T> {
  // eslint-disable-next-line consistent-return
  return new Promise((resolve) => {
    if (document.getElementById(selector)) {
      return resolve(document.getElementById(selector) as T);
    }

    const observer = new MutationObserver(() => {
      if (document.getElementById(selector)) {
        resolve(document.getElementById(selector) as T);
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
