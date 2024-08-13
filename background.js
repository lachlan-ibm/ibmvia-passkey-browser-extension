console.log("I am background script");

// chrome.tabs.onCreated.addListener(function (tab) {
//     console.log(tab);
// })
// chrome.tabs.onActivated.addListener(function (tab) {
//     console.log(tab);
// })


// listen to message from content script

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    sendResponse({ message: "Response from background script" });
})
// Inject a content script into the tab's main world when the browser action button is clicked.
// chrome.action.onClicked.addListener((tab) => {
//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         files: ['main.js']
//     });
