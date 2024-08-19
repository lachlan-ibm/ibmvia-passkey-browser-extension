// Receive message from content script (main.js) and send message to background script
// document.addEventListener("messageToMiddleScript", function (e) {
//   let data = e.detail;
//   console.log("e", e);
//   console.log("Message received from content script (main.js):", data.message);
//   messageBackgroundScriptAndDispatchMessageToContentScript();
//   // dispatchMessageResponseToContentScript({
//   //     title: "Response",
//   //     messsage: "Thanks for the message main.js, my name is middle.js, nice to meet ya!"
//   // });
// });

document.addEventListener("requestFidoUtilsConfig", function (e) {
  let data = e.detail;
  retrieveFidoUtilsConfigFromBackgroundScript();
});

// Send response to content script (main.js)
// function dispatchMessageResponseToContentScript(data) {
//     document.dispatchEvent(new CustomEvent("start", { detail: data }));
// }

async function retrieveFidoUtilsConfigFromBackgroundScript() {
  const response = await chrome.runtime.sendMessage({
    message: "Retrieve fidoutilsConfig variable",
  });
  //   console.log("response", response.result);
  // document.dispatchEvent(new CustomEvent(""))
  document.dispatchEvent(
    new CustomEvent("setFidoUtilsConfig", {
      detail: {
        title: "Response",
        message: "Sending fidoutilsConfig to main.js",
        obj: response.result,
      },
    })
  );
  const backgroundResult = response.result;
  console.log("middle script fidoutils is", backgroundResult);
  return await backgroundResult;
}

// function to send message to background script
// async function messageBackgroundScriptAndDispatchMessageToContentScript() {
//   const response = await chrome.runtime.sendMessage({
//     message: "Hello background script",
//   });
//   // console.log("response", response);
//   // console.log("response", response.responded);
//   if (response.responded === true) {
//     document.dispatchEvent(
//       new CustomEvent("responseToContentScriptFromMiddleScript", {
//         detail: {
//           title: "Response",
//           message: "Why hello there, content script",
//           status: "verified",
//         },
//       })
//     );
//   }
//   return await response;
// }
