// Background script starts here

console.log("I am background script");
console.log("find me", fido.BrowserApi);
console.log("gsdgdsgsd")
fido.BrowserApi.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

// fido.BrowserApi.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
//   console.log("Received message:", request);
//   if (request.message === 'injectScript') {
//     try {
//       await chrome.scripting.executeScript({
//         target: { tabId: sender.tab.id },
//         func: () => {
//           const script = document.createElement('script');
//           script.src = browser.runtime.getURL('main.js');
//           script.onload = function () {
//             this.remove();
//           };
//           (document.head || document.documentElement).appendChild(script);
//         }
//       });
//       console.log("Script injected successfully.");
//     } catch (error) {
//       console.error("Error injecting script:", error);
//     }
//   }
// });

// Set side panel to specific site only
if (fido.BrowserApi.isChromeApi) {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
}


fido.BrowserApi.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    console.log("hello")
    if (message.action === 'registerClicked') {
      const sidePanelApi = fido.BrowserApi.sidePanel;
      if (sidePanelApi) {
        try {
          if (fido.BrowserApi.isChromeApi) {
            await sidePanelApi.open({ tabId: sender.tab.id, windowId: sender.tab.windowId });
          }
        } catch (error) {
          console.error("Error opening side panel:", error);
        }
      } else {
        console.error("Side panel API not supported in this browser.");
      }
    }
  })();
});

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

fido.BrowserApi.runtime.onMessage.addListener(function (request, sender, sendResponse) {
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
// End of background Script