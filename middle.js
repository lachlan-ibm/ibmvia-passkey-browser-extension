// browserApi.js
class BrowserApi {
    static isChromeApi = navigator.userAgent.includes("Chrome");
    static isFirefoxApi = navigator.userAgent.includes("Firefox");

    static get runtime() {
        return this.isChromeApi ? chrome.runtime : browser.runtime;
    }

    static get sidePanel() {
        if (this.isChromeApi) {
            return chrome.sidePanel;
        } else if (this.isFirefoxApi) {
            return browser.sidebarAction;
        }
        return null;
    }
}
// middle script starts here

document.addEventListener("requestFidoUtilsConfig", async function (e) {
    let data = e.detail;
    // console.log("e.detail", data);
    const response = await BrowserApi.runtime.sendMessage({
        message: "Retrieve fidoutilsConfig variable",
    });

    // console.log("response in middle script", response);
    if (BrowserApi.isFirefoxApi) {
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
    return await backgroundResult;
});

document.addEventListener("requestUserPresence", async function (e) {
    let data = e.detail;
    await retrieveUserPresence();
});

document.addEventListener("clickedRegisterBtn", async function (e) {
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const userPresenceModal = document.getElementById("user-presence");
    if (userPresenceModal) {
        userPresenceModal.style.display = "block";
    }
})

document.addEventListener("requestUpdatedFidoUtilsConfig", async function (e) {
    let data = e.detail;
    const response = await BrowserApi.runtime.sendMessage({
        message: "Retrieve fidoutilsConfig variable",
    });
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

const browserapi = BrowserApi;
async function retrieveFidoUtilsConfigFromBackgroundScript() {
    const response = await browserapi.runtime.sendMessage({
        message: "Retrieve fidoutilsConfig variable",
    });
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
    let loadingIndicator = document.getElementById("loading-indicator");
    let spinner = document.getElementById('spinner');
    // spinner.classList.add('spinner');

    const style = document.createElement('style');
    style.textContent = `
      .spinner {
        border: 8px solid #60a5fa;
        
        border-top: 8px solid #2563eb;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        margin-bottom:5px;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    // loadingIndicator.appendChild(spinner);
    document.head.appendChild(style);
    if (button) {
        button.addEventListener("click", async function () {
            if (form.style.display === "none") {
                // Show the loading indicator first
                loadingIndicator.style.display = "block";
                form.style.display = "none";

                // Fetch and display FIDO utils config data
                let data = await retrieveFidoUtilsConfigFromBackgroundScript();
                await displayFidoUtilsConfigObject(data);
                loadingIndicator.style.display = "none";
                form.style.display = "block";
                button.innerHTML = "FIDO2 Config &#8722";
            } else {
                // Hide the form
                form.style.display = "none";
                button.innerHTML = "FIDO2 Config &#43";
            }
        });
    }
});

async function displayFidoUtilsConfigObject(o) {
    let exportButton = document.getElementById("file-saver");
    exportButton.style.display = "block";
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
    let tpmAaguidInput = document.getElementById("tpm-aaguid");
    if (tpmAaguidInput) {
        tpmAaguidInput.value = o["tpm"].aaguid;
    }

    let tpmCertInput = document.getElementById("tpm-cert");
    if (tpmCertInput) {
        tpmCertInput.value = o["tpm"].cert;
    }

    let tpmPrivateKeyPEMInput = document.getElementById("tpm-privateKeyPEM");
    if (tpmPrivateKeyPEMInput) {
        tpmPrivateKeyPEMInput.value = o["tpm"].privateKeyPEM;
    }

    let tpmPublicKeyPEMInput = document.getElementById("tpm-publicKeyPEM");
    if (tpmPublicKeyPEMInput) {
        tpmPublicKeyPEMInput.value = o["tpm"].publicKeyPEM;
    }

    let tpmIntercertInput = document.getElementById("tpm-interCertInput");
    if (tpmIntercertInput) {
        tpmIntercertInput.value = o["tpm"].tpmIntercert;
    }
}

const fidoUtilsForm = document.getElementById("fidoutilsForm");
const successMessage = document.getElementById("successMessage");
const browserApiAbstraction = BrowserApi.runtime;


if (fidoUtilsForm) {
    fidoUtilsForm.addEventListener("submit", async function (event) {
        event.preventDefault();
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
            "tpm": {
                aaguid: document.getElementById("tpm-aaguid").value,
                cert: document.getElementById("tpm-cert").value,
                privateKeyPEM: document.getElementById("tpm-privateKeyPEM").value,
                publicKeyPEM: document.getElementById("tpm-publicKeyPEM").value,
                tpmIntercert: document.getElementById("tpm-interCertInput").value,
            }
        };

        console.log("Updated FIDO Utils Config:", updatedFidoUtilsConfig);

        // Send the updated fidoutils object to the background script
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
            const reader = new FileReader();
            reader.addEventListener("load", async event => {
                // output.textContent = event.target.result;
                const data = event.target.result;
                const fidoUtilsConfigFromFile = JSON.parse(data);
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
        const logo = document.createElement("img")
        const yesBtn = document.createElement("button");
        const noBtn = document.createElement("button");
        const title = document.createElement("h6")
        const logoDiv = document.createElement("div");

        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;700&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);


        logoDiv.style.display = "flex";
        logoDiv.style.justifyContent = "center";
        logoDiv.style.alignItems = "center";

        modal.classList.add("confirmDownloadModal");

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
        modal.style.border = "1px solid #c3e6cb";

        modal.style.fontFamily = "'IBM Plex Sans', sans-serif";
        modalContent.style.fontFamily = "'IBM Plex Sans', sans-serif";

        // Set modal content styles
        modalContent.innerText = "Are you sure you want to export your credential?";
        modalContent.style.marginBottom = "20px";
        modalContent.style.lineHeight = "1.4";
        modalContent.style.marginTop = "10px";

        // logo
        logo.src = "data:image/png;base64,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"
        logo.style.width = "30px";
        logo.style.height = "30px";
        title.style.display = "flex";
        title.style.alignItems = "center";
        title.style.marginBottom = "0px";
        title.innerHTML = "IBM Passkey Extension";
        title.style.fontFamily = "IBM Plex Sans, sans-serif";
        title.style.fontSize = "larger";
        title.style.marginLeft = "10px"
        title.style.marginTop = "10px"

        // Set button container styles
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "space-between";

        // Set yes button styles
        yesBtn.classList.add("confirmDownload");
        yesBtn.style.backgroundColor = "#1d4ed8";
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
        noBtn.classList.add("cancelDownload");
        noBtn.style.backgroundColor = "#94a3b8";
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
        logoDiv.appendChild(logo);
        logoDiv.appendChild(title);
        modal.appendChild(logoDiv);
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
const browserApi = BrowserApi;

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