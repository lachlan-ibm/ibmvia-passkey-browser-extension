// Background script starts here

console.log("I am background script");
console.log("find me");
// console.log("fido util config object = ");

function setFidoUtilsConfig(fidoUtils) {
  let newFidoUtilsConfigObject = {};
  const fidoUtilsObject = fido.getFidoUtilsConfig();
  //   console.log("This is the set method", fidoUtilsObject);
  //   console.log(
  //     "This is the set method encryptionPassphrase",
  //     fidoUtilsObject["encryptionPassphrase"]
  //   );
  //   newFidoUtilsConfigObject["encryptionPassphrase"] =
  //     fidoUtilsObject["encryptionPassphrase"];
  //   newFidoUtilsConfigObject[""]
  //   console.log("the newly created fidoutils ", newFidoUtilsConfigObject);
  return fidoUtilsObject;
}

// setFidoUtilsConfig();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "Retrieve fidoutilsConfig variable") {
    console.log("Received request for the fidoUtilsConfig object");
    // console.log(setFidoUtilsConfig);
    const obj = setFidoUtilsConfig();
    console.log("fidoutils obj in background script", obj);
    sendResponse({ result: obj });
  }
});

// Interact with side panel


// Set side panel to specific site only
// chrome.sidePanel
//   .setPanelBehavior({ openPanelOnActionClick: true })
//   .catch((error) => console.error(error));

// const ORIGIN = "https://fidointerop.securitypoc.com/*";

// chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
//   if (!tab.url) return;
//   const url = new this.URL(tab.url);
//   if (url.origin === ORIGIN) {
//     await chrome.sidePanel.setOptions({
//       tabId,
//       path: "side_panel.html",
//       enabled: true
//     });
//   } else {
//     await chrome.sidePanel.setOptions({
//       tabId,
//       enabled: false
//     });
//   }
// })

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.message === "Hello background script") {
//     console.log(
//       "Message received from middle script (middle.js):",
//       request.message
//     );
//     console.log("This is the background script, call custom create method");
//     // Process the custom create credentials method in main.js
//     sendResponse({ responded: true });
//   }
// });

// communcation with popup.js
// chrome.runtime.onConnect.addListener(function (port) {
//     console.assert(port.name === "knockknock");
//     port.onMessage.addListener(function (msg) {
//         if (msg.joke === "Knock knock")
//             port.postMessage({ question: "Who's there?" });
//         else if (msg.answer === "Madame")
//             port.postMessage({ question: "Madame who?" });
//         else if (msg.answer === "Madame... Bovary")
//             port.postMessage({ question: "I don't get it." });
//     });
// });
// chrome.tabs.onCreated.addListener(function (tab) {
//     console.log(tab);
// })
// chrome.tabs.onActivated.addListener(function (tab) {
//     console.log(tab);
// })

// listen to message from content script
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     console.log(message);
//     sendResponse({ message: "Response from background script" });
// })
// Inject a content script into the tab's main world when the browser action button is clicked.
// chrome.action.onClicked.addListener((tab) => {
//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         files: ['main.js']
//     });
// Background script ends here