

// Receive message from content script (main.js) and send message to background script
document.addEventListener("tester", function (e) {
    let data = e.detail;
    console.log("e", e);
    console.log("content script (main.js) message received:", data.message);


    messageBackgroundScriptAndReturnResponseToContentScript();


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
async function messageBackgroundScriptAndReturnResponseToContentScript() {
    const response = await chrome.runtime.sendMessage({ greeting: "hello" });
    // console.log("response", response);
    // console.log("response", response.responded);
    if (response.responded === true) {
        document.dispatchEvent(new CustomEvent("response", {
            detail: {
                title: "Response",
                message: "Thanks for the message main.js, my name is middle.js, nice to meet ya!"
            }
        }));
    }
    return await response;
};

