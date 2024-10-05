// Background script starts here
console.log("Background Script");
fido.BrowserApi.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

// Programtically inject main.js

// fido.BrowserApi.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
// 	console.log("Received message:", request);
// 	if (request.message === 'injectScript') {
// 		console.log("received request to load content script main.js")
// 		try {
// 			if (fido.BrowserApi.isChromeApi) {
// 				await fido.BrowserApi.scripting.executeScript({
// 					target: { tabId: sender.tab.id },
// 					func: () => {
// 						const script = document.createElement('script');
// 						script.src = fido.BrowserApi.runtime.getURL('main.js');
// 						script.onload = function () {
// 							this.remove();
// 						};
// 						(document.head || document.documentElement).appendChild(script);
// 					}
// 				});
// 			} else if (fido.BrowserApi.isFirefoxApi) {
// 				browser.action.onClicked.addListener(async (tab) => {
// 					try {
// 						await browser.scripting.executeScript({
// 							target: {
// 								tabId: tab.id,
// 								allFrames: true,
// 							},
// 							files: ["main.js"],
// 						});
// 					} catch (err) {
// 						console.error(`failed to execute script: ${err}`);
// 					}
// 				});
// 			}

// 			console.log("Script injected successfully.");
// 		} catch (error) {
// 			console.error("Error injecting script:", error);
// 		}
// 	}
// });

// Set side panel
if (fido.BrowserApi.isChromeApi) {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
} else {
  // Set for firefox
  browser.sidebarAction
    .setPanel({ panel: "side_panel.html" })
    .catch((error) => console.error(error));

  browser.windows.getCurrent({ populate: true }).then((windowInfo) => {
    myWindowId = windowInfo.id;
  });

  browser.action.onClicked.addListener(() => {
    browser.sidebarAction.open();
  });
}

// Delcare the fidoutilsConfig which will be populated with different attestation keys
let fidoutilsConfig = {};

// Retrieve the current FIDO utils config
function getFidoUtilsConfig() {
  fidoutilsConfig = fido.getFido2ClientConfigJSON();
  return fidoutilsConfig;
}

// Update the FIDO utils config
function updateFidoUtilsConfig(newConfig) {
  fidoutilsConfig = newConfig;
  console.log("Updated FIDO utils config:", fidoutilsConfig);
  fido.setFido2ClientConfigJSON(newConfig);
}

// Listen for message sent from middle.js to retrieve or update fido utils config
fido.BrowserApi.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("")
  if (request.message === "Retrieve fidoutilsConfig variable") {
    console.log("Received request for the fidoutilsConfig object");
    const config = getFidoUtilsConfig();
    console.log("config is ", config)
    sendResponse({ result: config });
    return true;
  } else if (request.message === "Update fidoutilsConfig variable") {
    console.log("Received request to update the fidoutilsConfig object");
    const config = updateFidoUtilsConfig(request.config);
    console.log("this is a test", fidoutilsConfig);
    sendResponse({ status: "success", message: "Config updated successfully", result: config });
    return true;
  }
  return true;
});
// End of background Script