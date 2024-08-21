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
        // console.log("resolved find me");
      } else {
        reject("Failed to retrieve fidoutilsConfig");
      }
      // remove the event listener after handling the response
      document.removeEventListener("setFidoUtilsConfig", handleConfigResponse);
      console.log("find me!!!!");
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
document.addEventListener("setFidoUtilsConfig", function (e) {
  // console.log("find me");
  // console.log("e", e);
  let data = e.detail;
  console.log(
    "Response received from middle script (middle.js):",
    data.message
  );
  let fidoUtils = fido.getFidoUtilsConfig();
  console.log("old fido utils config", fidoUtils);
  // console.log("potential fido utils config", data.obj);
  fidoUtils = data.obj;
  fidoUtils["origin"] = window.location.origin;
  fido.setFidoUtilsConfig(fidoUtils);
  console.log("new fido utils config", fidoUtils);
  // console.log("e", e);
});

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
    const fidoutilsConfig = await requestFidoUtilsConfig();
    console.log("Received fidoutilsConfig from middle script:", fidoutilsConfig);

    // Set the origin in the config
    // fidoutilsConfig["origin"] = window.location.origin;
    // fido.setFidoUtilsConfig(fidoutilsConfig);
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
        return await serverPublicKeyCredential;
      } else {
        return await myCredentials.get(options);
      }
    }
  } catch (error) {
    console.log("Error getting credential:", error);
    console.log("Falling back to original navigator.credentials.get() method");
    return await myCredentials.get(options);
  }
}
// Override navigator.credentials.get
navigator.credentials.get = myGetMethod;

// Content Script ends here
