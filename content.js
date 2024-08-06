(function () {
  alert("Script working, this is main.js now");
  // Create a wrapper for navigator.credentials. The myCredentials object holds reference to the original WebAuthn methods.
  let myCredentials = {
    create: navigator.credentials.create.bind(navigator.credentials),
    get: navigator.credentials.get.bind(navigator.credentials),
  };

  // based off lachlans pseudo-code I need to check if the request can processed and return the required promise if so, otherwise fallbacl to default behaviour

  // Create a function to check if the request can be processed??

  // function processCreateRequest(options) {
  // 	if ("credentials" in navigator) {
  // 		if (options && options.publicKey) {
  // 		}
  // 	}
  // }

  async function myCreateMethod(options) {
    // console.log("My credential create function called");
    // // Modifying the relying party name
    // options.publicKey.rp.name = "Sachin's Ext";
    // console.log("Modified options: ", options);
    // if processCreateRequest(options)
    try {
      // Call the original method by accessing the myCredentials object
      // const result = await myCredentials.create(options);
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

        // publicCred.id = fido.base64toBA(publicCred.id);

        // publicCred.rawId = fido.base64toBA(publicCred.rawId);

        publicCred.response.attestationObject = fido.base64toBA(
          fido.base64utobase64(publicCred.response.attestationObject)
        );
        publicCred.response.clientDataJSON = fido.base64toBA(
          fido.base64utobase64(publicCred.response.clientDataJSON)
        );

        console.log("Public Cred:", publicCred);
        console.log("Result", result);
        return await publicCred;
        // return credentialCreationOptions;
      } else {
        return await myCredentials.create(options);
      }
    } catch (error) {
      console.error("Error creating credential:", error);
      throw error;
    }
    // else fallback to original create method return myCredntials.create(options)
  }
  // Override navigator.credentials.create
  navigator.credentials.create = myCreateMethod;

  async function myGetMethod(options) {
    try {
      if ("credentials" in navigator) {
        const result = await fido.processCredentialRequestOptions(options);
        let credOptions = result;
        credOptions["getClientExtensionResults"] = function () {
          return {};
        }
        // credOptions.response[authenticatorData] = "authenticatorData manually set";
        console.log("cred options authenticatorData is", credOptions.response.authenticatorData);
        credOptions.response.authenticatorData = fido.base64toBA(
          fido.base64utobase64(credOptions.response.authenticatorData)
        );
        credOptions.response.clientDataJSON = fido.base64toBA(
          fido.base64utobase64(credOptions.response.clientDataJSON)
        );
        credOptions.response.signature = fido.base64toBA(
          fido.base64utobase64(credOptions.response.signature)
        );
        // credOptions.response.userHandle = credOptions.res

        // credOptions.authenticatorData = credOptions.
        // credOptions.authenticatorData = fido.base64toBA(fido.base64utobase64(credOptions.resp))
        // credOptions.response.clientDataJSON = "clientDataJSON manually set";
        // console.log(
        // 	"Attempting to get credentials with the following options:",
        // 	options
        // );
        console.log("myGetMethod result is", credOptions);
        console.log("Assertion flow successful!");
        return await credOptions;
      }
    } catch (error) {
      console.log("Error getting credential:", error);
      console.log("Falling back to original navigator.credentials.get() method");
      return await myCredentials.get(options);
    }
  }
  navigator.credentials.get = myGetMethod;


  // const btn = document.getElementById("nicknamediv");

  // try {
  //   btn.addEventListener("click", () => {
  //     console.log("FIDO2 browser extension, Save Registration button clicked");
  //     // Check if navigator.credentials is available
  //     console.log(
  //       "Shanes func",
  //       fido.attestationOptionsResponeToCredentialCreationOptions
  //     );
  //   });
  // } catch (error) {
  //   console.log("error");
  // }
})();
