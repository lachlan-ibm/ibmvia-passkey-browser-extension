// Background script starts here

console.log("I am background script");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "Hello background script") {
        console.log("Message received from middle script (middle.js):", request.message);
        console.log("This is the background script, call custom create method");
        // Process the custom create credentials method in main.js
        sendResponse({ responded: true });
    }
})

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