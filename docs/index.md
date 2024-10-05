# IBM Passkey Extension Documentation

Welcome to the docs for the IBM passkey extension. This is an open-source project which aims to provide passkey support to major vendors such as chromium, firefox and webkit. This browser extension also aims to provide developers/technical sales a tool for demonstrating passkey functionality without using hardware based security keys.

To get started, you are encouraged to install from source:

```bash
git clone https://github.com/lachlan-ibm/ibm-security-passkey-extension.git
cd ibm-security-passkey-extension
```

In the root directory run the build command. As there are variations in configuration files, adding the browser option will generate the appropriate build artefacts for each vendor. If no argument is passed, the default is chrome. Once you have generated the build directory containing the browser specific artefacts, you need to install the extension on your browser.

#### Chrome Installation

```bash
bash buildScript.sh -b chrome
```

For chrome, there are several installation methods. Ideally, the extension should be distributed via officially supported distribution mechanisms.

- Chrome Web Store
- Self-hosting

However, as this tool is still in development, it can be tested by loading an unpacked version. In this case, see [Chrome Tutorial](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world) for instructions on how to load an unpacked extension. Choose the build directory as the extension directory.

#### Firefox Installation

```bash
bash buildScript.sh -b firefox
```

See the [Firefox Tutorial](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension) and refer to the install section for steps on how to install on firefox, or use the [web-ext](https://github.com/mozilla/web-ext) tool to run the extension from the command line. Furtermore, firefox provides the ability to load a zipped version of the extension as well, which is located the dist directory which is one of the artefacts generated after running the build command.

After you have installed the ibm passkey extension, try the [Quickstart Guide](quickstart.md).
