(function () {
  alert("Script working");
  // Create a wrapper for navigator.credentials. The myCredentials object holds reference to the original WebAuthn methods.
  let myCredentials = {
    create: navigator.credentials.create.bind(navigator.credentials),
    get: navigator.credentials.get.bind(navigator.credentials),
  };

  // based off lachlans pseudo-code I need to check if the request can processed and return the required promise if so, otherwise fallbacl to default behaviour

  // Create a function to check if the request can be processed??

  // function processCreateRequest(options) {
  //   if ("credentials" in navigator) {
  //     if (options && options.publicKey) {
  //     }
  //   }
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
          return result.spkc;
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
        return await publicCred;
        // return credentialCreationOptions;
      } else {
        await myCredentials.create(options);
      }
    } catch (error) {
      console.error("Error creating credential:", error);
      throw error;
    }
    // else fallback to original create method return myCredntials.create(options)
  }
  // Override navigator.credentials.create
  navigator.credentials.create = myCreateMethod;

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

