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

document.addEventListener("requestFidoUtilsConfig", async function (e) {
  let data = e.detail;
  await retrieveFidoUtilsConfigFromBackgroundScript();
});

document.addEventListener("requestUpdatedFidoUtilsConfig", async function (e) {
  let data = e.detail;
  await retrieveFidoUtilsConfigFromBackgroundScript();
});

// Send response to content script (main.js)
// function dispatchMessageResponseToContentScript(data) {
//     document.dispatchEvent(new CustomEvent("start", { detail: data }));
// }

async function retrieveFidoUtilsConfigFromBackgroundScript() {
  const response = await chrome.runtime.sendMessage({
    message: "Retrieve fidoutilsConfig variable",
  });
  console.log("response in midddsadasle script", response);
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
  console.log("middle script fidoutils is", backgroundResult);
  return await backgroundResult;
}

// async function retrieveUpdatedFidoUtilsConfigFromBackgroundScript() {
//   console.log("This is the update functionality find me")
//   const response = await chrome.runtime.sendMessage({
//     message: "Update fidoutilsConfig variable",
//   });
//   //   console.log("response", response.result);
//   // document.dispatchEvent(new CustomEvent(""))
//   document.dispatchEvent(
//     new CustomEvent("setUpdatedFidoUtilsConfig", {
//       detail: {
//         title: "Response",
//         message: "Sending updated fidoutilsConfig to main.js",
//         obj: response.result,
//       },
//     })
//   );
//   const backgroundResult = response.result;
//   console.log("middle script updated fidoutils is", backgroundResult);
//   return await backgroundResult;
// }


// async function retrieveUpdatedFidoUtilsConfigFromBackgroundScript() {
//   const response = await chrome.runtime.sendMessage({
//     message: "Retrieve updated fidoutilsConfig variable",
//   });
//   //   console.log("response", response.result);
//   // document.dispatchEvent(new CustomEvent(""))
//   document.dispatchEvent(
//     new CustomEvent("setFidoUtilsConfig", {
//       detail: {
//         title: "Response",
//         message: "Sending fidoutilsConfig to main.js",
//         obj: response.result,
//       },
//     })
//   );
//   const backgroundResult = response.result;
//   console.log("middle script fidoutils is", backgroundResult);
//   return await backgroundResult;
// }

// function to send message to background script
// async function messageBackgroundScriptAndDispatchMessageToContentScript() {
//   const response = await chrome.runtime.sendMessage({
//     message: "Hello background script",
//   });
//   // console.log("response", response);
//   // console.log("response", response.responded);
//   if (response.responded === true) {
//     document.dispatchEvent(
//       new CustomEvent("responseToContentScriptFromMiddleScript", {
//         detail: {
//           title: "Response",
//           message: "Why hello there, content script",
//           status: "verified",
//         },
//       })
//     );
//   }
//   return await response;
// }

// Interaction with side panel

// function listenForRegisterButtonClick() {

// }
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
});



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
    const response = await chrome.runtime.sendMessage({
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

