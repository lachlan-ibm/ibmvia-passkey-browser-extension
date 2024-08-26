// Content Script starts here

// alert("Script working, this is main.js now");
console.log("I am content script!!!");
// Create a wrapper for navigator.credentials. The myCredentials object holds reference to the original WebAuthn methods.
let myCredentials = {
  create: navigator.credentials.create.bind(navigator.credentials),
  get: navigator.credentials.get.bind(navigator.credentials),
};

// function to dispatch a request to the middle script for the fidoutilsConfig
function requestFidoUtilsConfig() {
  return new Promise((resolve, reject) => {
    // Listen for the response from the middle script
    function handleConfigResponse(e) {
      if (e.detail && e.detail.obj) {
        resolve(e.detail.obj);
        console.log("resolved find me");
      } else {
        reject("Failed to retrieve fidoutilsConfig");
      }
      // remove the event listener after handling the response
      document.removeEventListener("setFidoUtilsConfig", handleConfigResponse);
    }
    document.addEventListener("setFidoUtilsConfig", handleConfigResponse);
    // dispatch event to request fidoutilsConfig from middle script
    document.dispatchEvent(
      new CustomEvent("requestFidoUtilsConfig", {
        detail: { title: "getFidoUtils", message: "Retrieve fidoutilsConfig variable" },
      })
    );
  });
}

// document.addEventListener("setFidoUtilsConfig", function (e) {
// 	// console.log("find me");
// 	// console.log("e", e);
// 	let data = e.detail;
// 	console.log(
// 		"Response received from middle script (middle.js):",
// 		data.message
// 	);
// 	let fidoUtils = fido.getFidoUtilsConfig();
// 	console.log("old fido utils config", fidoUtils);
// 	// console.log("potential fido utils config", data.obj);
// 	fidoUtils = data.obj;
// 	fidoUtils["origin"] = window.location.origin;
// 	fido.setFidoUtilsConfig(fidoUtils);
// 	console.log("new fido utils config", fidoUtils);
// 	// console.log("e", e);
// });

// function to dispatch a request to the middle script for the updated fidoutilsConfig

// document.addEventListener("setUpdatedFidoUtilsConfig", function (e) {
// 	// console.log("find me");
// 	// console.log("e", e);
// 	let data = e.detail;
// 	console.log(
// 		"Response received from middle script (middle.js):",
// 		data.message
// 	);
// 	let fidoUtils = fido.getFidoUtilsConfig();
// 	console.log("old fido utils config", fidoUtils);
// 	// console.log("potential fido utils config", data.obj);
// 	fidoUtils = data.obj;
// 	fidoUtils["origin"] = window.location.origin;
// 	fido.setFidoUtilsConfig(fidoUtils);
// 	console.log("new fido utils config", fidoUtils);
// 	// console.log("e", e);
// });
function showSuccessModal(message) {
  // Create modal elements
  const modal = document.createElement("div");
  const overlay = document.createElement("div");
  const modalContent = document.createElement("div");
  const spinner = document.createElement("div");

  // Set the content and styling
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = 1000;

  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.backgroundColor = "#fff";
  modal.style.color = "#155724";
  modal.style.padding = "20px";
  modal.style.zIndex = 1001;
  modal.style.borderRadius = "8px";
  modal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
  modal.style.textAlign = "center";
  modal.style.border = "1px solid #c3e6cb";

  // Spinner styling
  spinner.style.border = "8px solid #c3e6cb";
  spinner.style.borderTop = "8px solid #155724";
  spinner.style.borderRadius = "50%";
  spinner.style.width = "40px";
  spinner.style.height = "40px";
  spinner.style.animation = "spin 1s linear infinite";
  spinner.style.margin = "0 auto";

  // Inline style block for spinner animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  // Add the style block to modal
  modal.appendChild(style);

  // Set modal content
  modalContent.innerText = message;
  modalContent.style.marginTop = "10px";
  modalContent.style.fontWeight = "bold";

  // Append elements
  modal.appendChild(spinner);
  modal.appendChild(modalContent);
  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  // Automatically remove modal after 3 seconds
  setTimeout(() => {
    document.body.removeChild(modal);
    document.body.removeChild(overlay);
  }, 3000);
}

async function myCreateMethod(options) {
  // Send message to middle script
  //   async function dispatchMessageToMiddleScriptEvent(data) {
  //     document.dispatchEvent(
  //       new CustomEvent("messageToMiddleScript", { detail: data })
  //     );
  //   }

  // async function dispatchGetFidoUtilsConfig(data) {
  // 	document.dispatchEvent(
  // 		new CustomEvent("requestFidoUtilsConfig", { detail: data })
  // 	);
  // }
  // await dispatchGetFidoUtilsConfig({
  // 	title: "getFidoUtils",
  // 	message: "Retrieve fidoutilsConfig variable",
  // });

  //   await dispatchMessageToMiddleScriptEvent({
  //     title: "Messaging system",
  //     message: "Hello there middle script!",
  //   });
  // Only call this if we want to so use if statement 


  // document.addEventListener("middle script messaging", function (e) {
  // 	console.log("content script received")
  // })

  try {
    let oldFidoUtilsConfig = fido.getFidoUtilsConfig();
    console.log("old fido utils", oldFidoUtilsConfig);
    let newFidoutilsConfig = await requestFidoUtilsConfig();
    // const updatedFidoUtilsConfigidoutilsConfig = await requestUpdatedFidoUtilsConfig();
    // console.log("Received fidoutilsConfig from middle script:", fidoutilsConfig);
    // console.log("Received fidoutilsConfig from middle script:", updatedFidoUtilsConfigidoutilsConfig);

    // Set the origin in the config
    newFidoutilsConfig["origin"] = window.location.origin;
    // Set the fidoUtilsConfig object with the new one retrieved from the background script then middle script
    fido.setFidoUtilsConfig(newFidoutilsConfig);
    console.log("new fido utils", newFidoutilsConfig);
    if ("publicKey" in options) {
      const result = await fido.processCredentialCreationOptions(options);
      console.log("options", options);
      console.log("Credentials created:", result);
      let publicCred = result.spkc;

      publicCred["getClientExtensionResults"] = function () {
        return {};
      };
      publicCred["toJSON"] = function () {
        return result;
      };
      publicCred.response.attestationObject = fido.base64toBA(
        fido.base64utobase64(publicCred.response.attestationObject)
      );
      publicCred.response.clientDataJSON = fido.base64toBA(
        fido.base64utobase64(publicCred.response.clientDataJSON)
      );

      // console.log("Public Cred:", publicCred);
      // console.log("Result", result);
      showSuccessModal("Custom create method successful. Creating new credential.");
      await new Promise(resolve => setTimeout(resolve, 3000));
      return await publicCred;

      // else fallback to original create method return myCredntials.create(options)
    } else {
      return await myCredentials.create(options);
    }

  } catch (error) {
    console.error("Error creating credential:", error);
    throw error;
  }
}
// receive message from middle script
// document.addEventListener(
//   "responseToContentScriptFromMiddleScript",
//   function (e) {
//     // console.log("find me");
//     let data = e.detail;
//     if (data.status === "verified") {
//       console.log("data", data.status);
//       console.log(
//         "Message received from middle script (middle.js):",
//         data.message
//       );
//     }
//     // console.log("e", e);
//   }
// );
// Override navigator.credentials.create
navigator.credentials.create = myCreateMethod;

function showFailModal(message) {
  // Create modal elements
  const modal = document.createElement("div");
  const overlay = document.createElement("div");
  const modalContent = document.createElement("div");
  const spinner = document.createElement("div");

  // Set the content and styling
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = 1000;

  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.backgroundColor = "#fff";
  modal.style.color = "#721c24";
  modal.style.padding = "20px";
  modal.style.zIndex = 1001;
  modal.style.borderRadius = "8px";
  modal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
  modal.style.textAlign = "center";
  modal.style.border = "1px solid #f5c6cb";

  // Spinner styling
  spinner.style.border = "8px solid #f5c6cb";
  spinner.style.borderTop = "8px solid #721c24";
  spinner.style.borderRadius = "50%";
  spinner.style.width = "40px";
  spinner.style.height = "40px";
  spinner.style.animation = "spin 1s linear infinite";
  spinner.style.margin = "0 auto";

  // Inline style block for spinner animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  // Add the style block to modal
  modal.appendChild(style);

  // Set modal content
  modalContent.innerText = message;
  modalContent.style.marginTop = "10px";
  modalContent.style.fontWeight = "bold";

  // Append elements
  modal.appendChild(spinner);
  modal.appendChild(modalContent);
  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  // Automatically remove modal after 3 seconds
  setTimeout(() => {
    document.body.removeChild(modal);
    document.body.removeChild(overlay);
  }, 3000);
}

// Close modal on button click
// closeButton.addEventListener("click", function () {
//   document.body.removeChild(modal);
//   document.body.removeChild(overlay);
// });

// Close modal when clicking outside of it
// overlay.addEventListener("click", function () {
//   document.body.removeChild(modal);
//   document.body.removeChild(overlay);
// });


async function myGetMethod(options, authRecords) {
  try {
    if ("credentials" in navigator) {
      if (fido.canAuthenticateWithCredId(options)) {
        console.log("options", options);
        const result = await fido.processCredentialRequestOptions(
          options,
          authRecords
        );
        let serverPublicKeyCredential = result;
        serverPublicKeyCredential["getClientExtensionResults"] = function () {
          return {};
        };
        console.log(
          "cred options authenticatorData is",
          serverPublicKeyCredential.response.authenticatorData
        );
        serverPublicKeyCredential.response.authenticatorData = fido.base64toBA(
          fido.base64utobase64(
            serverPublicKeyCredential.response.authenticatorData
          )
        );
        serverPublicKeyCredential.response.clientDataJSON = fido.base64toBA(
          fido.base64utobase64(
            serverPublicKeyCredential.response.clientDataJSON
          )
        );
        serverPublicKeyCredential.response.signature = fido.base64toBA(
          fido.base64utobase64(serverPublicKeyCredential.response.signature)
        );
        console.log("myGetMethod result is", serverPublicKeyCredential);
        console.log("Assertion flow successful!");
        showSuccessModal("Custom get method called. Authenticating credential.");
        await new Promise(resolve => setTimeout(resolve, 3000));
        return await serverPublicKeyCredential;
      } else {
        showFailModal("Custom authentication failed. Falling back to default method.");
        await new Promise(resolve => setTimeout(resolve, 3000));
        return await myCredentials.get(options);
      }
    }
  } catch (error) {
    console.log("Error getting credential:", error);
    console.log("Falling back to original navigator.credentials.get() method");
    // alert("Falling back to original get method");
    showFailModal("Custom authentication failed. Falling back to default method.");
    await new Promise(resolve => setTimeout(resolve, 3000));
    return await myCredentials.get(options);
  }
}
// Override navigator.credentials.get
navigator.credentials.get = myGetMethod;

// Content Script ends here
