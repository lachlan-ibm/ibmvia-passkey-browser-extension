<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/ibm-cloud--hyper-protect-crypto-services-96x96.png">
  <img alt="IBM passkey extension logo" src="docs/ibm-cloud--hyper-protect-crypto-services-96x96.png" width="15%" height="25%">
</picture>

IBM Passkey Extension: A cross platform browser extension for creating [FIDO2](https://fidoalliance.org/fido2/) passkey credentials.

<h3>

[Documentation](https://lachlan-ibm.github.io/ibmvia-passkey-browser-extension/)

</h3>
</div>

---

This is an open-source project which aims to provide passkey support to major vendors such as chromium, firefox and webkit. This project relies on a [command-line NodeJS client](https://github.com/sbweeden/fido2-node-clients) developed by IBMer [Shane Weeden](https://github.com/sbweeden). It also aims to provide developers/technical sales a tool for demonstrating passkey functionality without using hardware based security keys.

## Features

### Register

This extension can succesfully [register](https://webauthn.guide/#registration) a FIDO2 credential at the following relying parties:

- [WebAuthn.io](https://webauthn.io/)
- [webauthn.dodo.dev](https://webauthn.dodo.dev/passwordless)
- [token2](https://www.token2.com/tools/fido2-demo)

Additionally, if you have access to w3id on IBM Security Verify, you can test the extension against a [demonstration](https://fidointerop.securitypoc.com/) site managed by IBMer, Shane Weeden.

### Authenticate

Once resgistration has finished, you can then perform an assertion flow and [authenticate](https://webauthn.guide/#authentication) using the extension.

## Installation

As the extension is still in early development, it has not yet been published on any browser stores. Hence, you are encouraged to install from the source.

### From source for Chrome

```sh
git clone https://github.com/lachlan-ibm/ibmvia-passkey-browser-extension
cd ibmvia-passkey-browser-extension
bash buildScript.sh -b chrome
```

### From source for Firefox

```sh
git clone https://github.com/lachlan-ibm/ibmvia-passkey-browser-extension
cd ibmvia-passkey-browser-extension
bash buildScript.sh -b firefox
```

### Removing the Build Artefacts

To clean up your directory after executing the build script you can run:

```sh
bash buildScript.sh -c
```

## Documentation

Documentation along with a quick start guide can be found on the [docs website](https://lachlan-ibm.github.io/ibmvia-passkey-browser-extension/) built from the [docs/](/docs) directory.

## Contributing
Following the guidelines in the [CONTRIBUTING file/](CONTRIBUTING.md) will help your PR get accepted.
