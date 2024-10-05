const { Builder, Browser, By, until } = require("selenium-webdriver");
const assert = require("assert");
const chrome = require('selenium-webdriver/chrome');
const path = require('path');



(async function firstTest() {
    let driver;
    try {
        const extensionPath = path.resolve('../build/');
        // const extensionPath = path.resolve('./build.crx');
        const EXTENSION_ID = "mbgkfnogadopfimoaenckddoecaijjbi";
        const downloadPath = path.resolve("/Users/sachinramsamy/Downloads/");
        let options = new chrome.Options();
        options.addArguments(`--load-extension=${extensionPath}`);
        options.setUserPreferences({
            "download.prompt_for_download": false,
            "download.default_directory": downloadPath,
            "download.directory_upgrade": true,
            "safebrowsing.enabled": true
        });

        // driver = await new Builder()
        //     .forBrowser(Browser.CHROME)
        //     .setChromeOptions(options)
        //     .build();


        // To use crx
        // let options = new chrome.Options();
        // options.addExtensions(extensionPath);
        // options.addArguments("--verbose");

        // options.addArguments("--incognito")

        driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();
        driver.manage().deleteAllCookies();
        await driver.sleep(2000);
        await driver.get("https://webauthn.io/");
        let title = await driver.getTitle();
        assert.equal("WebAuthn.io", title)
        await driver.manage().setTimeouts({ implicit: 500 });

        let inputBox = await driver.findElement(By.id("input-email"));
        let registerBtn = await driver.findElement(By.id("register-button"));
        await driver.sleep(5000);

        // Take action on element
        await inputBox.sendKeys("Sach");
        await registerBtn.click();
        await driver.manage().setTimeouts({ implicit: 3000 });
        let userPresenceModal = await driver.findElement(By.className("userPresenceModal"));
        await driver.wait(until.elementIsVisible(driver.findElement(By.className("userPresenceModal"))), 1000);
        console.log("Fetching user presence body content and asserting it");
        await driver.manage().setTimeouts({ implicit: 1000 });
        let userPresenceModalBody = await driver.findElement(By.className("userPresenceModalBody"));
        await driver.wait(until.elementIsVisible(driver.findElement(By.className("userPresenceModalBody"))), 1000);
        assert.equal(await userPresenceModalBody.getText(), "Would you like to create a new passkey?", "Verify modal body message");


        // assert.equal(userPresenceModalBody.getText(), "Would you like to create a new FIDO2 credential?", "Verify modal body message");

        await driver.manage().setTimeouts({ implicit: 3000 });

        let yesBtn = userPresenceModal.findElement(By.xpath(".//button[contains(text(), 'Yes')]"));
        yesBtn.click();

        await driver.wait(until.elementLocated(By.css(".alert"))).then(el => el.getText()
            .then(x => assert.equal("Success! Now try to authenticate...", x))).then(() => {
                return driver.sleep(3000);
            })

        // await driver.manage().setTimeouts({ implicit: 2000 });

        let authenticateBtn = driver.findElement(By.id("login-button"));
        assert.ok(authenticateBtn, "Authenticate button is present");
        authenticateBtn.click();

        // open the side panel

        const initialWindow = await driver.getAllWindowHandles();
        assert.strictEqual(initialWindow.length, 1);

        await driver.switchTo().newWindow("tab");
        await driver.get(`chrome-extension://${EXTENSION_ID}/side_panel.html`);

        const browserTabs = await driver.getAllWindowHandles();
        assert.strictEqual(browserTabs.length, 2);

        // Click the FIDO2 Config button to display the object
        let fidoutilsConfigButton = await driver.findElement(By.id("triggerBtn"));
        fidoutilsConfigButton.click();

        // Update encryption passphrase property
        let encryptionPassphraseInput = await driver.findElement(By.id("encryption"));
        await encryptionPassphraseInput.clear();
        let updatedEncroptionPassphrase = "000-000-000";
        await encryptionPassphraseInput.sendKeys(updatedEncroptionPassphrase);
        // Click the update button
        let updateButton = await driver.findElement(By.id("saveBtn"));
        await updateButton.click();

        // Test export
        let exportButton = await driver.findElement(By.id("file-saver"));
        await exportButton.click();
        await driver.manage().setTimeouts({ implicit: 3000 });
        let confirmExportModal = await driver.findElement(By.className("confirmDownloadModal"));
        await driver.wait(until.elementIsVisible(driver.findElement(By.className("confirmDownloadModal"))), 1000);
        let confirmExportButton = await driver.findElement(By.className("confirmDownload"));
        confirmExportButton.click();
        // Give the browser some time to complete the download
        await driver.sleep(5000);
        // await reloadExtension(driver, EXTENSION_ID);

        // end of opening the side panel

    } catch (e) {
        console.log(e);
    } finally {
        // End the session
        // await driver.quit();
    }
}());
async function reloadExtension(driver, extensionId) {
    // Navigate to the Chrome extensions page
    await driver.get("chrome://extensions");
    await driver.sleep(2000);

    // Access the shadow DOM of the extensions manager
    const extensionsManager = await driver.findElement(By.tagName("extensions-manager"));
    const shadowRoot1 = await driver.executeScript("return arguments[0].shadowRoot", extensionsManager);

    // Access the shadow DOM of the extensions item list
    const extensionsItemList = await shadowRoot1.findElement(By.tagName("extensions-item-list"));
    const shadowRoot2 = await driver.executeScript("return arguments[0].shadowRoot", extensionsItemList);

    // Access the shadow DOM of the specific extensions item
    const extensionItem = await shadowRoot2.findElement(By.tagName(`extensions-item`));
    const shadowRoot3 = await driver.executeScript("return arguments[0].shadowRoot", extensionItem);

    // Find the Reload button for your extension
    const reloadButton = await shadowRoot3.querySelector("cr-button#reload");
    await reloadButton.click();
    await driver.sleep(2000);

    // Return to the extension's side panel
    await driver.switchTo().newWindow("tab");
    await driver.get(`chrome-extension://${extensionId}/side_panel.html`);
    await driver.sleep(2000);
}


// firstTest();

