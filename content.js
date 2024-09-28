// Content Script starts here

console.log("I am content script!!!");
// Create a wrapper for navigator.credentials. The myCredentials object holds reference to the original WebAuthn methods.
let myCredentials = {
  create: navigator.credentials.create.bind(navigator.credentials),
  get: navigator.credentials.get.bind(navigator.credentials),
};

// alert("main.js injected!")
// function to dispatch a request to the middle script for the fidoutilsConfig
function requestFidoUtilsConfig() {
  return new Promise((resolve, reject) => {
    // Listen for the response from the middle script
    function handleConfigResponse(e) {
      // console.log("eee", e.detail.response.result);
      if (e.detail && e.detail.response.result) {
        resolve(e.detail.response.result);
        // console.log("resolved find me");
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

function showSuccessModal(message) {
  // Create modal elements
  const modal = document.createElement("div");
  const overlay = document.createElement("div");
  const modalContent = document.createElement("div");
  const spinner = document.createElement("div");
  const logo = document.createElement("img")
  const title = document.createElement("h6")
  const logoDiv = document.createElement("div");

  const link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;700&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);


  logoDiv.style.display = "flex";
  logoDiv.style.justifyContent = "center";
  logoDiv.style.alignItems = "center";



  // Set the content and styling
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = 1000;
  // logo
  logo.src = "data:image/png;base64,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";

  logo.style.width = "30px";
  logo.style.height = "30px";

  title.style.display = "flex";
  title.style.alignItems = "center";
  title.style.marginBottom = "0px";
  title.innerHTML = "IBM Passkey Extension";
  title.style.fontFamily = "IBM Plex Sans, sans-serif";
  title.style.fontSize = "larger";
  title.style.marginLeft = "10px"

  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.backgroundColor = "#fff";
  modal.style.padding = "20px";
  modal.style.zIndex = 1001;
  modal.style.borderRadius = "8px";
  modal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
  modal.style.textAlign = "center";
  modal.style.border = "1px solid #c3e6cb";

  modal.style.fontFamily = "'IBM Plex Sans', sans-serif";
  modalContent.style.fontFamily = "'IBM Plex Sans', sans-serif";


  // Spinner styling
  spinner.style.border = "8px solid #60a5fa";
  spinner.style.borderTop = "8px solid #2563eb";
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


  // Append elements
  logoDiv.appendChild(logo);
  logoDiv.appendChild(title);
  // modal.appendChild(logo);
  // modal.appendChild(title);
  modal.appendChild(logoDiv);
  modal.appendChild(spinner);
  modal.appendChild(modalContent);
  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  // Automatically remove modal after 3 seconds
  setTimeout(() => {
    document.body.removeChild(modal);
    document.body.removeChild(overlay);
  }, 2750);
}

// User presence modal
function userPresenceModal() {
  return new Promise((resolve) => {
    // Create modal elements
    const modal = document.createElement("div");
    const overlay = document.createElement("div");
    const modalContent = document.createElement("div");
    const buttonContainer = document.createElement("div");
    const yesBtn = document.createElement("button");
    const noBtn = document.createElement("button");
    const logo = document.createElement("img")
    const title = document.createElement("h6")
    const logoDiv = document.createElement("div");

    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = 1000;


    logoDiv.style.display = "flex";
    logoDiv.style.justifyContent = "center";
    logoDiv.style.alignItems = "center";


    modal.classList.add("userPresenceModal");

    // Set modal styles
    modal.style.position = "fixed";
    modal.style.width = "350px"
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.backgroundColor = "#fff";
    modal.style.padding = "20px";
    modal.style.zIndex = 1001;
    modal.style.borderRadius = "8px";
    modal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
    modal.style.textAlign = "center";
    modal.style.border = "1px solid #c3e6cb";
    // modal.style.width = "300px";

    modal.style.fontFamily = "'IBM Plex Sans', sans-serif";
    modalContent.style.fontFamily = "'IBM Plex Sans', sans-serif";

    // Set modal content styles
    modalContent.classList.add("userPresenceModalBody");
    modalContent.innerText = "Would you like to create a new passkey?";
    modalContent.style.marginTop = "10px";
    modalContent.style.marginBottom = "20px"

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

    // Set button container styles

    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "space-between";

    // Set yes button styles
    yesBtn.setAttribute("id", "yesBtn");
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
    noBtn.setAttribute("id", "noBtn");
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
    // modal.appendChild(logo);
    // modal.appendChild(title);
    modal.appendChild(logoDiv);
    modal.appendChild(modalContent);


    modal.appendChild(buttonContainer);

    document.body.appendChild(modal);

    const handleClick = (result) => {
      resolve(result);
      document.body.removeChild(modal);
    }

    yesBtn.onclick = () => handleClick(true);
    noBtn.onclick = () => handleClick(false);
  });
}

async function myCreateMethod(options) {

  try {
    const userPresence = await userPresenceModal();
    console.log("user presence", userPresence);
    let oldFidoUtilsConfig = fido.getFidoUtilsConfig();
    // console.log("old fido utils", oldFidoUtilsConfig);
    let newFidoutilsConfig = await requestFidoUtilsConfig();

    // Set the origin in the config
    newFidoutilsConfig["origin"] = window.location.origin;
    // Set the fidoUtilsConfig object with the new one retrieved from the background script then middle script
    fido.setFidoUtilsConfig(newFidoutilsConfig);
    // console.log("new fido utils", newFidoutilsConfig);
    if ("publicKey" in options) {
      if (options.publicKey.challenge instanceof ArrayBuffer) {
        console.log("find me array buffer");
        options.publicKey.challenge = new Uint8Array(options.publicKey.challenge);
        console.log("new normalised challenge is", options.publicKey.challenge);
      }
      if (userPresence) {
        const result = await fido.processCredentialCreationOptions(options, "packed-self");
        console.log("options", options);
        console.log("Credentials created:", result);
        let publicCred = result.spkc;

        publicCred["getClientExtensionResults"] = function () {
          return {};
        };
        publicCred["toJSON"] = function () {
          return result;
        };

        publicCred.rawId = fido.base64toBA(fido.base64utobase64(publicCred.rawId));


        publicCred.response.attestationObject = fido.base64toBA(
          fido.base64utobase64(publicCred.response.attestationObject)
        );


        publicCred.response.clientDataJSON = fido.base64toBA(
          fido.base64utobase64(publicCred.response.clientDataJSON)
        );


        // console.log("Public Cred:", publicCred);
        //   console.log("Result", result);
        showSuccessModal("Custom create method successful. Creating new credential.");
        await new Promise(resolve => setTimeout(resolve, 3000));
        return await publicCred;

      } else {
        return await myCredentials.create(options);
      }

      // else fallback to original create method return myCredntials.create(options)
    } else {
      return await myCredentials.create(options);
    }

  } catch (error) {
    console.error("Error creating credential:", error);
    throw error;
  }
}
navigator.credentials.create = myCreateMethod;

function showFailModal(message) {
  // Create modal elements
  const modal = document.createElement("div");
  const overlay = document.createElement("div");
  const modalContent = document.createElement("div");
  const logo = document.createElement("img")
  const title = document.createElement("h6")

  const spinner = document.createElement("div");
  const logoDiv = document.createElement("div");

  logoDiv.style.display = "flex";
  logoDiv.style.justifyContent = "center";
  logoDiv.style.alignItems = "center";

  title.style.display = "flex";
  title.style.alignItems = "center";
  title.style.marginBottom = "0px";
  title.innerHTML = "IBM Passkey Extension";
  title.style.fontFamily = "IBM Plex Sans, sans-serif";
  title.style.fontSize = "larger";
  title.style.marginLeft = "10px";


  // Set the content and styling
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = 1000;

  // logo
  logo.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAABepJREFUeF7tnTGPFDcUx+1DKUibLEJUkcIRKW3SB4pI9PkAQVk+AR1pAg10+QQsIh8gfSSKLH1okeCSKFUUsVBTcY68jLm5Ze33t/2ex57zFRSs1zPz+/k9P8/szGjV/yYloCfdet+46gImHgRdQBcwMYGJN98joAuQJXD55uaq3cKBUleNUd+Mtrb9f6XU2v6jtXriPnvxYHFHdq9Oep9lBFjo2qifhsN0oGOZrq2UY6XWfz5YbCVJ/M1KwAh8KnQvY63VXYnImIUASfC7RrhFNC2gJPixCCuBKzU1K2CA/7tEXkb75IiGJgVcubm5Y04mWYTX+wnVNXYT67hKsp8NlRI8h+RKaE5ABPy10equhZpSxdjtDEJcNSUyQTclAIS/BZ8CfR9hcJt2HZFUJTUjAAGRCgHJYVLbb0IAcPCso94nBJn4jVbXYqKvegHAQa+PVotryCjmanO43NjqyztRx0ioXgAx+ovDdxIJCfB+VS2ASj1Hq8Wk+x+SgEbBpAdApYTD5cb42qAHSG0j53MiPUJRUK2A0OiXrHZihYT2Exkk1QoIjf6pU8+upEAqIqOgSgGh0JYY/Z/deHnRQv3n0YX/YiPAtg/tLzVYqhTgC2tO+F/8sLlktP7eKPOdMubLLXitn2mlf9XG/PL84eLfGBm+KKDSUJUCfAfDJeDz5evrB+rtLaX0t/shm8fH6tzPf60++Q2VEIiCYBqqVcDe6ocKZwSWHfnH2jzyw3e9mMcHRt9AIyE1DVUnIFBVkBMaIuDK8tVto8w9pK1W+scXq0/vI21tm5Q01IwArvRzuNz8oZT6CoT69Gi1+Bpsq3yDJzQPnCkBttr56ED9rbQ+D0E15s3RwwsfQ20D1VBo8FQnICWMUUBdAEBKUsCQp8VSkG8ibi0CxCogK0ByEh4E79t/bwFRYwoSFSBVho5OU3+w/z0CdlKfxEJsTgL2Xm2ilvTA9HKqCfepiNA5odYioIiAWGFI+1msA3JO7SKQJNvMQkDqSS1JsGjfvsETOodVXRWUelILhSTZzncRqSkBqSe1JMEifadew6guAlq5FrwrxTf6qeqtKgHUz1C4zogiIzqmTWi/qWsY1Qig4Nub6Ur/Ag6V4Bv9yICpQkDL8Jv/WUrL8NEICbWbNALOOnwrZjIBHf67uJhEQId/kpSKC+jwT88IRQV0+B9Ox8UEdPj7a6EiAjp8fyEqLqDDD68WRAXUCD903wHHwsrXh++ckJiAGuEPp7q9tz3NRkBp+PZKlH24EvI8n9lHwBTw3T27yNnHWQuYEr5LH5SE2QqoAT4iYZYCOOHbvizIUD6nHhUQioKUC+cxk3Ns/9lVEDd89yAmH8Qc+KEqiLp0iEooKkAKvi+V5MKflQBp+LsSOODPRgAnfAsF6S/0eBiq8hmnj9gUgaYe1y62/+g5AIGV8usFoN+9LGLgNx8BAKSsn44A/Z+SEAu/aQEAnCz4jiywnXfXUhMfkhebIqpIQQAUFvhUHkUWWhSw5gRwwpdeZFHwm0tB3PClF1mzEiAFX3KRNSsBxEkrOOeHRLqJlGuRdVYEwPBLL7LOhICUk1ZAOmNZZIECxO7CTLm/zbsS5i7XYiWk1vmUBMlnUVQtAExHWYssCn5oHziEpzxqrVgElFhk5Qiw301Jr26bobs7kx7YxJ2ChkVQ8KHXHKMQkZBzS5Gv/1All3SbKreAkqUmJQEpjak+xp8T81vaUxM5BdQEH0mFMZFIFRfJt6lyCagRPlgQBF8KMYC3r0b0vkcAESk6CdcK30UBNXqHdqdEuBOKwFucoAWrmIDa4Y9SUbAwGOV6+z5J9PVWEHzbd7SAmMnJ1xYJTY7toH1QgwXtx7Wj8v64v+ICaoMfmY6CLlKOraiAlB2MHX057XPeTZl6bMUEpO5gDtDU78aIyD2uIgJydzIVZO73AiK276ZE7keg9kFcQKvwx+CcCPfacw7wrv/oH2ZRRvvncQS6gDhe7K27AHakcR12AXG82Ft3AexI4zrsAuJ4sbf+HzTROKwaiaQ4AAAAAElFTkSuQmCC";

  logo.style.width = "30px";
  logo.style.height = "30px";

  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.backgroundColor = "#fff";
  modal.style.padding = "20px";
  modal.style.zIndex = 1001;
  modal.style.borderRadius = "8px";
  modal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
  modal.style.textAlign = "center";
  modal.style.border = "1px solid #c3e6cb";

  modal.style.fontFamily = "'IBM Plex Sans', sans-serif";
  modalContent.style.fontFamily = "'IBM Plex Sans', sans-serif";

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

  // Append elements
  modal.appendChild(logoDiv);
  logoDiv.appendChild(logo);
  logoDiv.appendChild(title);
  modal.appendChild(spinner);
  modal.appendChild(modalContent);

  // modal.appendChild(logo);
  // modal.appendChild(title);

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
      console.log("navigator.credentials", navigator.credentials)
      let fidoutilsConfigVariable = await requestFidoUtilsConfig();
      // console.log("finnnnnnd me", fidoutilsConfigVariable);
      fidoutilsConfigVariable["origin"] = window.location.origin;
      fido.setFidoUtilsConfig(fidoutilsConfigVariable);
      console.log("options in myGetMethod", options)

      if (options.publicKey.challenge instanceof ArrayBuffer) {
        options.publicKey.challenge = new Uint8Array(options.publicKey.challenge);
        console.log("new normalised challenge is", options.publicKey.challenge);
      }

      if (options.publicKey.allowCredentials instanceof Array) {
        console.log("options.publicKey.allowCredentials is instanceof Array")
        for (let i = 0; i < options.publicKey.allowCredentials.length; i++) {
          // Convert to Uint8Array if id is of type ArrayBuffer
          if (options.publicKey.allowCredentials[i].id instanceof ArrayBuffer) {
            console.log("moved here now")
            options.publicKey.allowCredentials[i].id = new Uint8Array(options.publicKey.allowCredentials[i].id)
          }
        }
      } else {
        console.log("error detected in allowedCred data type")
      }
      if (fido.canAuthenticateWithCredId(options)) {
        // console.log("options", options);
        const result = await fido.processCredentialRequestOptions(
          options
        );
        let serverPublicKeyCredential = result;
        serverPublicKeyCredential["getClientExtensionResults"] = function () {
          return {};
        };
        console.log("serverPublicKeyCredential", serverPublicKeyCredential);

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
        serverPublicKeyCredential.rawId = fido.base64toBA(fido.base64utobase64(serverPublicKeyCredential.rawId));

        console.log("myGetMethod result is", serverPublicKeyCredential);
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
    // showFailModal("Custom authentication failed. Falling back to default method.");
    await new Promise(resolve => setTimeout(resolve, 3000));
    return await myCredentials.get(options);
  }
}
// Override navigator.credentials.get
navigator.credentials.get = myGetMethod;

// Content Script ends here
