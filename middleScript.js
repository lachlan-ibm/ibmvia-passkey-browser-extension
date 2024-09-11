// middle script starts here

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
console.log("fido:", fido);
// console.log("fido.BrowserApi:", fido ? fido.BrowserApi : 'fido is undefined');

// fido.BrowserApi.runtime.sendMessage({
// 	message: "injectScript"
// });

const port = fido.BrowserApi.runtime.connect({ name: "middleScript" });

port.postMessage({ greeting: "hello" });

port.onMessage.addListener(function (message) {

    console.log(message.farewell);

});

// if (fido.BrowserApi.isFirefoxApi) {
// 	injectMainScript();
// }

// function injectMainScript() {
// 	const script = document.createElement('script');
// 	script.src = fido.BrowserApi.runtime.getURL('main.js');
// 	document.documentElement.appendChild(script);
// };

// console.log("middle script here", fido.BrowserApi)
// console.log("dsdas")

document.addEventListener("requestFidoUtilsConfig", async function (e) {
    let data = e.detail;
    // console.log("e.detail", data);
    // await retrieveFidoUtilsConfigFromBackgroundScript();
    const response = await fido.BrowserApi.runtime.sendMessage({
        message: "Retrieve fidoutilsConfig variable",
    });

    // console.log("response in middle script", response);
    if (fido.BrowserApi.isFirefoxApi) {
        var clonedDetail = cloneInto({ response: response }, document.defaultView);
        var event = new CustomEvent("setFidoUtilsConfig", { detail: clonedDetail })
        document.dispatchEvent(event);
    } else {
        document.dispatchEvent(
            new CustomEvent("setFidoUtilsConfig", {
                detail: {
                    title: "Response",
                    message: "Sending fidoutilsConfig to main.js",
                    response: response,
                },
            })
        );
    }


    const backgroundResult = response.result;
    // console.log("middle script fidoutils is", backgroundResult);
    return await backgroundResult;
    // tester();
    // exportFunction(tester, window, { defineAs: "tester" })
});

document.addEventListener("requestUserPresence", async function (e) {
    let data = e.detail;
    await retrieveUserPresence();
});

document.addEventListener("clickedRegisterBtn", async function (e) {
    // console.log(e);
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const userPresenceModal = document.getElementById("user-presence");
    if (userPresenceModal) {
        userPresenceModal.style.display = "block";
    }
})

document.addEventListener("requestUpdatedFidoUtilsConfig", async function (e) {
    let data = e.detail;
    // await retrieveFidoUtilsConfigFromBackgroundScript();
    const response = await fido.BrowserApi.runtime.sendMessage({
        message: "Retrieve fidoutilsConfig variable",
    });
    // console.log("response in midddsadasle script", response);
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
});


async function retrieveUserPresence() {
    document.dispatchEvent(
        new CustomEvent("setUserPresence", {
            detail: {
                title: "Response",
                message: "Sending user presence to main.js",
                userPresence: true,
            },
        })
    );
}

const browserapi = fido.BrowserApi;
// console.log("find me browse api", browserapi)
async function retrieveFidoUtilsConfigFromBackgroundScript() {
    // console.log("find me browse api", browserapi)
    const response = await browserapi.runtime.sendMessage({
        message: "Retrieve fidoutilsConfig variable",
    });
    // console.log("response in midddsadasle script", response);
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
    // console.log("middle script fidoutils is", backgroundResult);
    return await backgroundResult;
}




document.addEventListener("DOMContentLoaded", function () {

    let button = document.getElementById("triggerBtn");
    let form = document.getElementById("fidoutilsForm");

    if (button) {
        button.addEventListener("click", async function () {
            console.log("Clicked button");

            // Show the form
            form.style.display = "block";

            // Fetch and display FIDO utils config data
            let data = await retrieveFidoUtilsConfigFromBackgroundScript();
            await displayFidoUtilsConfigObject(data);
        });
    }

    const registerBtn = document.getElementById("registerAuthenticatorButton");
    if (registerBtn) {
        registerBtn.addEventListener("click", function () {
            fido.BrowserApi.runtime.sendMessage({ action: "registerClicked" })
        })
    }
});
// let userPresence;

// chrome.runtime.onMessage.addListener(async (message, sender, sendResponce) => {
//   if (message.action === "showUserPresenceModal") {
//     const result = await showUserPresenceModal();
//     let userPresence = result;
//     console.log("user presence result is ", userPresence);

//     // document.dispatchEvent(
//     //   new CustomEvent("setUserPresence", {
//     //     detail: {
//     //       title: "Response",
//     //       message: "Sending user presence to main.js",
//     //       userPresence: true,
//     //     },
//     //   })
//     // );
//   }
// })


async function showUserPresenceModal() {
    return new Promise((resolve, reject) => {
        const userPresenceModal = document.getElementById("user-presence");
        const mainContent = document.getElementById("main-content");
        if (!userPresenceModal) {
            return reject("User presence modal not found");
        }
        userPresenceModal.style.display = "block";
        const yesBtn = document.getElementById("yesBtn");
        const noBtn = document.getElementById("noBtn");
        const handleClick = (result) => {
            userPresenceModal.style.display = "none";
            if (mainContent) {
                mainContent.style.display = "block";
            }
            resolve(result);
            console.log("Yesss clicked")
            document.dispatchEvent(
                new CustomEvent("setUserPresence", {
                    detail: {
                        title: "Response",
                        message: "Sending user presence to main.js",
                        userPresence: true,
                    },
                })
            );
        };
        if (yesBtn) {
            yesBtn.onclick = () => handleClick(true);
        }
        if (noBtn) {
            noBtn.onclick = () => handleClick(false);
        }
    });
}
// async function displayFidoUtilsConfigObject(o) {
//   // console.log("this is the displayFidoUtilsConfigObject function", o);

//   // Display the encryption passphrase
//   let displayencryptionPassphrase = document.getElementById("encryptionPassphrase");
//   if (displayencryptionPassphrase) {
//     displayencryptionPassphrase.innerHTML = `<h4> Encryption Passphrase: </h4> ${o["encryptionPassphrase"]} `;
//   }
//   let encryptionPassphraseInput = document.getElementById("encryption");
//   if (encryptionPassphraseInput) {
//     encryptionPassphraseInput.value = o["encryptionPassphrase"];
//   }
//   // Display the fido-u2f data
//   let displayfidou2f = document.getElementById("cert");
//   if (displayfidou2f) {
//     displayfidou2f.innerHTML = `<h4> cert: </h4> ${o["fido-u2f"].cert}`;
//   }
//   let displayPrivateKeyHex = document.getElementById("privateKeyHex");
//   if (displayPrivateKeyHex) {
//     displayPrivateKeyHex.innerHTML = `<h4> Private Key: </h4> ${o["fido-u2f"].privateKeyHex}`;
//   }

//   let displayPublicKeyHex = document.getElementById("publicKeyHex");
//   if (displayPublicKeyHex) {
//     displayPublicKeyHex.innerHTML = `<h4> Public Key: </h4> ${o["fido-u2f"].publicKeyHex}`;
//   }

//   // Display the packed data
//   let displayPackedAaguid = document.getElementById("packed-aaguid");
//   if (displayPackedAaguid) {
//     displayPackedAaguid.innerHTML = `<h4> Packed aaguid: </h4> ${o["packed"].aaguid}`;
//   }

//   let displayPackedCert = document.getElementById("packed-cert");
//   if (displayPackedCert) {
//     displayPackedCert.innerHTML = `<h4> Packed Cert: </h4>${o["packed"].cert}`;
//   }

//   let displayPackedPrivateKeyHex = document.getElementById("packed-privateKeyHex");
//   if (displayPackedPrivateKeyHex) {
//     displayPackedPrivateKeyHex.innerHTML = `<h4> Packed Private Key: </h4> ${o["packed"].privateKeyHex}`;
//   }

//   let displayPackedPublicKeyHex = document.getElementById("packed-publicKeyHex");
//   if (displayPackedPublicKeyHex) {
//     displayPackedPublicKeyHex.innerHTML = `<h4> Packed Public Key: </h4> ${o["packed"].publicKeyHex}`;
//   }
//   // Dispaly the packed-self aaguid
//   let displayPackedSelfAaguid = document.getElementById("packed-self-aaguid");
//   if (displayPackedSelfAaguid) {
//     displayPackedSelfAaguid.innerHTML = `<h4> Packed-self aaguid: </h4> ${o["packed-self"].aaguid}`;
//   }
// }
async function displayFidoUtilsConfigObject(o) {
    // Populate the encryption passphrase
    let encryptionPassphraseInput = document.getElementById("encryption");
    if (encryptionPassphraseInput) {
        encryptionPassphraseInput.value = o["encryptionPassphrase"];
    }

    // Populate the FIDO-U2F data
    let certInput = document.getElementById("cert");
    if (certInput) {
        certInput.value = o["fido-u2f"].cert;
    }

    let privateKeyHexInput = document.getElementById("privateKeyHex");
    if (privateKeyHexInput) {
        privateKeyHexInput.value = o["fido-u2f"].privateKeyHex;
    }

    let publicKeyHexInput = document.getElementById("publicKeyHex");
    if (publicKeyHexInput) {
        publicKeyHexInput.value = o["fido-u2f"].publicKeyHex;
    }

    // Populate the packed data
    let packedAaguidInput = document.getElementById("packed-aaguid");
    if (packedAaguidInput) {
        packedAaguidInput.value = o["packed"].aaguid;
    }

    let packedCertInput = document.getElementById("packed-cert");
    if (packedCertInput) {
        packedCertInput.value = o["packed"].cert;
    }

    let packedPrivateKeyHexInput = document.getElementById("packed-privateKeyHex");
    if (packedPrivateKeyHexInput) {
        packedPrivateKeyHexInput.value = o["packed"].privateKeyHex;
    }

    let packedPublicKeyHexInput = document.getElementById("packed-publicKeyHex");
    if (packedPublicKeyHexInput) {
        packedPublicKeyHexInput.value = o["packed"].publicKeyHex;
    }

    let packedSelfAaguidInput = document.getElementById("packed-self-aaguid");
    if (packedSelfAaguidInput) {
        packedSelfAaguidInput.value = o["packed-self"].aaguid;
    }
}
async function displayFidoUtilsConfigObject(o) {
    // Populate the encryption passphrase
    let encryptionPassphraseInput = document.getElementById("encryption");
    if (encryptionPassphraseInput) {
        encryptionPassphraseInput.value = o["encryptionPassphrase"];
    }

    // Populate the FIDO-U2F data
    let certInput = document.getElementById("cert");
    if (certInput) {
        certInput.value = o["fido-u2f"].cert;
    }

    let privateKeyHexInput = document.getElementById("privateKeyHex");
    if (privateKeyHexInput) {
        privateKeyHexInput.value = o["fido-u2f"].privateKeyHex;
    }

    let publicKeyHexInput = document.getElementById("publicKeyHex");
    if (publicKeyHexInput) {
        publicKeyHexInput.value = o["fido-u2f"].publicKeyHex;
    }

    // Populate the packed data
    let packedAaguidInput = document.getElementById("packed-aaguid");
    if (packedAaguidInput) {
        packedAaguidInput.value = o["packed"].aaguid;
    }

    let packedCertInput = document.getElementById("packed-cert");
    if (packedCertInput) {
        packedCertInput.value = o["packed"].cert;
    }

    let packedPrivateKeyHexInput = document.getElementById("packed-privateKeyHex");
    if (packedPrivateKeyHexInput) {
        packedPrivateKeyHexInput.value = o["packed"].privateKeyHex;
    }

    let packedPublicKeyHexInput = document.getElementById("packed-publicKeyHex");
    if (packedPublicKeyHexInput) {
        packedPublicKeyHexInput.value = o["packed"].publicKeyHex;
    }

    let packedSelfAaguidInput = document.getElementById("packed-self-aaguid");
    if (packedSelfAaguidInput) {
        packedSelfAaguidInput.value = o["packed-self"].aaguid;
    }
}

const fidoUtilsForm = document.getElementById("fidoutilsForm");
const successMessage = document.getElementById("successMessage");

// const saveButton = document.getElementById("saveBtn");

// console.log("find me Save button listener")
// if (saveButton) {
//   saveButton.addEventListener("click", async function () {
//     console.log("Clicked save button");
//     let data = await retrieveUpdatedFidoUtilsConfigFromBackgroundScript();
//     await displayFidoUtilsConfigObject(data);
//   });
// }
const browserApiAbstraction = fido.BrowserApi.runtime;


if (fidoUtilsForm) {
    fidoUtilsForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        // console.log("find me!")
        const updatedFidoUtilsConfig = {
            encryptionPassphrase: document.getElementById("encryption").value,
            "fido-u2f": {
                cert: document.getElementById("cert").value,
                privateKeyHex: document.getElementById("privateKeyHex").value,
                publicKeyHex: document.getElementById("publicKeyHex").value,
            },
            "packed": {
                aaguid: document.getElementById("packed-aaguid").value,
                cert: document.getElementById("packed-cert").value,
                privateKeyHex: document.getElementById("packed-privateKeyHex").value,
                publicKeyHex: document.getElementById("packed-publicKeyHex").value,
            },
            "packed-self": {
                aaguid: document.getElementById("packed-self-aaguid").value,
            },
        };

        console.log("Updated FIDO Utils Config:", updatedFidoUtilsConfig);

        // I'm trying to send the updated fidoutils object to the background script
        const response = await browserApiAbstraction.sendMessage({
            message: "Update fidoutilsConfig variable",
            config: updatedFidoUtilsConfig,
        });


        if (response.status) {
            if (successMessage) {
                successMessage.style.display = "block";
            }
            setTimeout(() => {
                if (successMessage) {
                    successMessage.style.display = "none";
                }
            }, 3000)
        } else {
            console.error("Failed to update fidoutilsConfig");
        }
        // document.dispatchEvent(
        //   new CustomEvent("setUpdatedFidoUtilsConfig", {
        //     detail: {
        //       title: "Response",
        //       message: "Sending updatedfidoutilsConfig to main.js",
        //       obj: response.result,
        //     },
        //   })
        // );
        // console.log("Response from background script:", response);)
    });

}

// File system

if (window.FileList && window.File && window.FileReader) {
    const status = document.getElementById("status");
    const output = document.getElementById("output");
    const fileSelector = document.getElementById("file-selector");

    if (fileSelector) {

        fileSelector.addEventListener("change", event => {
            if (status) {
                status.textContent = "";
            }
            if (output) {
                output.textContent = "";
            }
            const file = event.target.files[0];
            // if (!file.type) {
            //   status.textContent = "Error. The file.type is not supported by the browser";
            //   return;
            // }
            const reader = new FileReader();
            reader.addEventListener("load", async event => {
                // output.textContent = event.target.result;
                const data = event.target.result;
                const fidoUtilsConfigFromFile = JSON.parse(data);

                // dispatch event/message to the background script to update the fido utils config using the file data
                // alert(fido);
                // fidoUtilsConfigFromFile = event.target.result;
                // JSON.parse(fidoUtilsConfigFromFile);
                console.log("fidoUtilsConfigFromFile: ", fidoUtilsConfigFromFile);
                const response = await retrieveFidoUtilsConfigFromBackgroundScript();
                await displayFidoUtilsConfigObject(fidoUtilsConfigFromFile);
                let form = document.getElementById("fidoutilsForm");
                if (form) {
                    form.style.display = "block";
                }

            });
            reader.readAsText(file);
        })

    }
}

// Confirmation modal to download fidoutils
function confirmDownloadModal() {
    return new Promise((resolve) => {
        // Create modal elements
        const modal = document.createElement("div");
        const modalContent = document.createElement("div");
        const buttonContainer = document.createElement("div");
        const yesBtn = document.createElement("button");
        const noBtn = document.createElement("button");

        // Set modal styles
        modal.style.position = "fixed";
        modal.style.top = "50%";
        modal.style.left = "50%";
        modal.style.transform = "translate(-50%, -50%)";
        modal.style.backgroundColor = "#fff";
        modal.style.color = "#333";
        modal.style.padding = "20px";
        modal.style.zIndex = 1001;
        modal.style.borderRadius = "12px";
        modal.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
        modal.style.textAlign = "center";
        modal.style.width = "300px";
        modal.style.fontFamily = "Arial, sans-serif";
        modal.style.border = "1px solid #ddd";

        // Set modal content styles
        modalContent.innerText = "Are you sure you want to download your credential?";
        modalContent.style.marginBottom = "20px";
        modalContent.style.fontWeight = "bold";
        modalContent.style.fontSize = "16px";
        modalContent.style.lineHeight = "1.4";

        // Set button container styles
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "space-between";

        // Set yes button styles
        yesBtn.style.backgroundColor = "#28a745";
        yesBtn.style.color = "#fff";
        yesBtn.style.border = "none";
        yesBtn.style.padding = "10px 20px";
        yesBtn.style.borderRadius = "5px";
        yesBtn.style.cursor = "pointer";
        yesBtn.style.flex = "1";
        yesBtn.style.marginRight = "10px";
        yesBtn.style.fontSize = "14px";
        yesBtn.innerText = "Yes";

        // Set no button styles
        noBtn.style.backgroundColor = "#dc3545";
        noBtn.style.color = "#fff";
        noBtn.style.border = "none";
        noBtn.style.padding = "10px 20px";
        noBtn.style.borderRadius = "5px";
        noBtn.style.cursor = "pointer";
        noBtn.style.flex = "1";
        noBtn.style.fontSize = "14px";
        noBtn.innerText = "No";

        // Append elements
        buttonContainer.appendChild(yesBtn);
        buttonContainer.appendChild(noBtn);
        modal.appendChild(modalContent);
        modal.appendChild(buttonContainer);
        document.body.appendChild(modal);

        // Handle button clicks
        const handleClick = (result) => {
            resolve(result);
            document.body.removeChild(modal);
        };

        yesBtn.onclick = () => handleClick(true);
        noBtn.onclick = () => handleClick(false);
    });
}



// Export fidoutils
const fileSaver = document.getElementById("file-saver");
const browserApi = fido.BrowserApi;

if (fileSaver) {
    fileSaver.addEventListener("click", async function saveFile() {
        const userConfirmed = await confirmDownloadModal();
        if (!userConfirmed) return;
        console.log("browserAPI", browserApi)
        console.log("firefox", browserApi.isFirefoxApi)
        try {
            const fidoUtilsConfigToWriteToFile = await retrieveFidoUtilsConfigFromBackgroundScript();
            const blob = new Blob([JSON.stringify(fidoUtilsConfigToWriteToFile)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'fido-utils-config.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err.name, err.message);
        }
    });
}
// middle script ends here