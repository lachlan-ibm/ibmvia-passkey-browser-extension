// Background script starts here

console.log("I am background script");
console.log("find me");

// console.log("fido util config object = ");

// function setFidoUtilsConfig(fidoUtils) {
//   let newFidoUtilsConfigObject = {};
//   const fidoUtilsObject = fido.getFidoUtilsConfig();
//   //   console.log("This is the set method", fidoUtilsObject);
//   //   console.log(
//   //     "This is the set method encryptionPassphrase",
//   //     fidoUtilsObject["encryptionPassphrase"]
//   //   );
//   //   newFidoUtilsConfigObject["encryptionPassphrase"] =
//   //     fidoUtilsObject["encryptionPassphrase"];
//   //   newFidoUtilsConfigObject[""]
//   //   console.log("the newly created fidoutils ", newFidoUtilsConfigObject);
//   return fidoUtilsObject;
// }

// setFidoUtilsConfig();

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
// 	if (request.message === "Retrieve fidoutilsConfig variable") {
// 		console.log("Received request for the fidoUtilsConfig object");
// 		// console.log(setFidoUtilsConfig);
// 		const obj = fido.getFido2ClientConfigJSON();
// 		console.log("fidoutils obj in background script", obj);
// 		sendResponse({ result: obj });
// 	}
// });

// Interact with side panel


// Set side panel to specific site only
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));




let windowId;
chrome.tabs.onActivated.addListener(function (activeInfo) {
  windowId = activeInfo.windowId;
});



chrome.runtime.onMessage.addListener((message, sender) => {
  (async () => {
    if (message.action === 'open_side_panel') {
      chrome.sidePanel.open({ windowId: windowId });
    }
  })();
});


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

// console.log("I am the background script");
// console.log("find me");

let fidoutilsConfig = {};

// Function to retrieve the current FIDO utils config
function getFidoUtilsConfig() {
  fidoutilsConfig = fido.getFido2ClientConfigJSON();
  console.log("Retrieved FIDO utils config:", fidoutilsConfig);
  return fidoutilsConfig;
}

// function setFidoUtilsConfig(newConfig) {
// 	fidoutilsConfig = newConfig;
// }

// Function to update the FIDO utils config
function updateFidoUtilsConfig(newConfig) {
  fidoutilsConfig = newConfig;
  console.log("Updated FIDO utils config:", fidoutilsConfig);
  fido.setFido2ClientConfigJSON(newConfig);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "Retrieve fidoutilsConfig variable") {
    console.log("Received request for the fidoutilsConfig object");
    const config = getFidoUtilsConfig();
    sendResponse({ result: config });
  } else if (request.message === "Update fidoutilsConfig variable") {
    console.log("Received request to update the fidoutilsConfig object");
    const config = updateFidoUtilsConfig(request.config);
    console.log("this is a test", fidoutilsConfig);
    sendResponse({ status: "success", message: "Config updated successfully", result: config });
  }
  return true;
});

// End of background script