const { Builder, Browser, By } = require("selenium-webdriver");
const assert = require("assert");
const chrome = require('selenium-webdriver/chrome');
const path = require('path');

(async function firstTest() {
    let driver;
    try {
        const extensionPath = path.resolve('../build/');
        let options = new chrome.Options();
        options.addArguments(`--load-extension=${extensionPath}`);



        driver = await new Builder()
            .forBrowser(Browser.CHROME)
            .setChromeOptions(options)
            .build();

        await driver.get("https://webauthn.io/");
        let title = await driver.getTitle();
        assert.equal("WebAuthn.io", title)
        await driver.manage().setTimeouts({ implicit: 500 });

        let inputBox = await driver.findElement(By.id("input-email"));
        let registerBtn = await driver.findElement(By.id("register-button"));

        // Take action on element
        await inputBox.sendKeys("SeleniumTest");
        await registerBtn.click();

        let message = await driver.findElement(By.className("alert"))
        // Request element information
        let value = await message.getText();
        assert.equal("Received!", value)
    } catch (e) {
        console.log(e);
    } finally {
        // End the session
        // await driver.quit();
    }
}())




