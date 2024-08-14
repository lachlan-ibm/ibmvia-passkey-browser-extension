

// Receive message from content script (main.js) and send message to background script
document.addEventListener("messageToMiddleScript", function (e) {
    let data = e.detail;
    console.log("e", e);
    console.log("Message received from content script (main.js):", data.message);
    messageBackgroundScriptAndDispatchMessageToContentScript();
    // dispatchMessageResponseToContentScript({
    //     title: "Response",
    //     messsage: "Thanks for the message main.js, my name is middle.js, nice to meet ya!"
    // });

})

// Send response to content script (main.js)
// function dispatchMessageResponseToContentScript(data) {
//     document.dispatchEvent(new CustomEvent("start", { detail: data }));
// }

// function to send message to background script
async function messageBackgroundScriptAndDispatchMessageToContentScript() {
    const response = await chrome.runtime.sendMessage({ message: "callCustomCreateMethod" });
    // console.log("response", response);
    // console.log("response", response.responded);
    if (response.responded === true) {
        document.dispatchEvent(new CustomEvent("responseToContentScriptFromMiddleScript", {
            detail: {
                title: "Response",
                message: "Why hello there, content script",
                status: "verified"
            }
        }));
    }
    return await response;
};

