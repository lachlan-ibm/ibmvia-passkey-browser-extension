const { Builder, Browser, By, until } = require("selenium-webdriver");
const assert = require("assert");
const chrome = require('selenium-webdriver/chrome');
const path = require('path');



(async function firstTest() {
    let driver;
    try {
        const extensionPath = path.resolve('../build/');
        // const extensionPath = path.resolve('./build.crx');
        // const EXTENSION_ID = "goikhgffpigmooahdiabmipldbkeebnd";
        let options = new chrome.Options();
        options.addArguments(`--load-extension=${extensionPath}`);

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
        authenticateBtn.click();

        // open the side panel

        // const initialWindow = await driver.getAllWindowHandles();
        // assert.strictEqual(initialWindow.length, 1);

        // await driver.switchTo().newWindow("tab");
        // await driver.get(`chrome-extension://${EXTENSION_ID}/side_panel.html`);

        // const browserTabs = await driver.getAllWindowHandles();
        // assert.strictEqual(browserTabs.length, 2);


        // let fidoutilsConfigButton = await driver.findElement(By.id("triggerBtn"));
        // fidoutilsConfigButton.click();

        // end of opening the side panel

    } catch (e) {
        console.log(e);
    } finally {
        // End the session
        // await driver.quit();
    }
}());


// firstTest();

