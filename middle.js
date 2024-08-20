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

document.addEventListener("requestFidoUtilsConfig", function (e) {
  let data = e.detail;
  retrieveFidoUtilsConfigFromBackgroundScript();
});

// Send response to content script (main.js)
// function dispatchMessageResponseToContentScript(data) {
//     document.dispatchEvent(new CustomEvent("start", { detail: data }));
// }

async function retrieveFidoUtilsConfigFromBackgroundScript() {
  const response = await chrome.runtime.sendMessage({
    message: "Retrieve fidoutilsConfig variable",
  });
  //   console.log("response", response.result);
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
let button = document.getElementById("triggerBtn");
console.log("find me button listener")
if (button) {
  button.addEventListener("click", async function () {
    console.log("Clicked button");
    let data = await retrieveFidoUtilsConfigFromBackgroundScript();
    await displayFidoUtilsConfigObject(data);
  });
}

async function displayFidoUtilsConfigObject(o) {
  // console.log("this is the displayFidoUtilsConfigObject function", o);

  // Display the encryption passphrase
  let displayencryptionPassphrase = document.getElementById("encryptionPassphrase");
  if (displayencryptionPassphrase) {
    displayencryptionPassphrase.innerHTML = `<h4> Encryption Passphrase: </h4> ${o["encryptionPassphrase"]} `;
  }
  // Display the fido-u2f data
  let displayfidou2f = document.getElementById("cert");
  if (displayfidou2f) {
    displayfidou2f.innerHTML = `<h4> cert: </h4> ${o["fido-u2f"].cert}`;
  }
  let displayPrivateKeyHex = document.getElementById("privateKeyHex");
  if (displayPrivateKeyHex) {
    displayPrivateKeyHex.innerHTML = `<h4> Private Key: </h4> ${o["fido-u2f"].privateKeyHex}`;
  }

  let displayPublicKeyHex = document.getElementById("publicKeyHex");
  if (displayPublicKeyHex) {
    displayPublicKeyHex.innerHTML = `<h4> Public Key: </h4> ${o["fido-u2f"].publicKeyHex}`;
  }

  // Display the packed data
  let displayPackedAaguid = document.getElementById("packed-aaguid");
  if (displayPackedAaguid) {
    displayPackedAaguid.innerHTML = `<h4> Packed aaguid: </h4> ${o["packed"].aaguid}`;
  }

  let displayPackedCert = document.getElementById("packed-cert");
  if (displayPackedCert) {
    displayPackedCert.innerHTML = `<h4> Packed Cert: </h4>${o["packed"].cert}`;
  }

  let displayPackedPrivateKeyHex = document.getElementById("packed-privateKeyHex");
  if (displayPackedPrivateKeyHex) {
    displayPackedPrivateKeyHex.innerHTML = `<h4> Packed Private Key: </h4> ${o["packed"].privateKeyHex}`;
  }

  let displayPackedPublicKeyHex = document.getElementById("packed-publicKeyHex");
  if (displayPackedPublicKeyHex) {
    displayPackedPublicKeyHex.innerHTML = `<h4> Packed Public Key: </h4> ${o["packed"].publicKeyHex}`;
  }
  // Dispaly the packed-self aaguid
  let displayPackedSelfAaguid = document.getElementById("packed-self-aaguid");
  if (displayPackedSelfAaguid) {
    displayPackedSelfAaguid.innerHTML = `<h4> Packed-self aaguid: </h4> ${o["packed-self"].aaguid}`;
  }


}








