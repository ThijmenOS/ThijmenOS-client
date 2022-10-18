// class OS {
//   #listen(callback) {
//     window.onmessage = (e) => {
//       callback(e.data);
//     };
//   }
//   call(method, params, callback) {
//     let appName = document
//       .getElementById("os-class-element")
//       .getAttribute("data-id");
//     window.top.postMessage(
//       {
//         origin: appName,
//         method: method,
//         params: params,
//       },
//       "https://thijmenbrand.nl"
//     );

//     if (callback) this.#listen(callback);
//   }
// }
