document.addEventListener("DOMContentLoaded", runFunction);
console.log("DOM is loaded");

var port = chrome.runtime.connect({ name: "knockknock" });


function runFunction() {
    let button = document.getElementById("clickme");

    button.addEventListener("click", function () {
        console.log("Clicked button");
        document.body.style.backgroundColor = "#90e0ef";
        port.postMessage({ joke: "Knock knock" });
        port.onMessage.addListener(function (msg) {
            if (msg.question === "Who's there?")
                port.postMessage({ answer: "Madame" });
            else if (msg.question === "Madame who?")
                port.postMessage({ answer: "Madame... Bovary" });
        });
    })
}






