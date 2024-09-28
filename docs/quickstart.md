#### Chrome

Once you have successfuly installed the extension on your chrome browser, you should see it listed under the 'All extensions' section.

![alt text](all_extensions.png "Title")

Click on the 'details' button and toggle the option to pin the extension to your chrome toolbar - this will make opening the sidebar easier by clicking on the icon.

![alt text](pin_toolbar.png "Title")

Open the side panel to view by clicking on the extensions icon in your google chrome toolbar.

![alt text](toolbar_chrome.png "Title")

#### Firefox
On firefox, 

Once the side panel is open, you will see the FIDO2 Config button.

![alt text](side_panel.png "Title")

Click this button to display the FIDO2 configuration object.
The FIDO2 config object contains attestation keys for various attestation types that the extension supports. This configuration allows you to manage the different key pairs used in FIDO2 operations.

![alt text](fido2_object.png "Title")

You can modify various parameters within the FIDO2 config object. After making your changes, click the Update button located below the FIDO2 object.

This action will update the FIDO2 object with your new values. Upon successful update, a success message will be displayed.

![alt text](update_fido2_object.png "Title")

Next, navigate to a webpage that supports WebAuthn registration and authentication ceremonies such as:

- [WebAuthn.io](https://webauthn.io/)
- [webauthn.dodo.dev](https://webauthn.dodo.dev/passwordless)
- [token2](https://www.token2.com/tools/fido2-demo)

Additionally, if you have access to w3id on IBM Security Verify, you can test the extension against a [demonstration site](https://fidointerop.securitypoc.com/) managed by IBMer, Shane Weeden.

