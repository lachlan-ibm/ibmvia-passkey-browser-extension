const { Builder, Browser, By, until } = require("selenium-webdriver");
const assert = require("assert");
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const { elementLocated } = require("selenium-webdriver/lib/until");

// describe("Waits", function () {
//     let driver;
//     before(async function () {
//         const extensionPath = path.resolve('../build/');
//         // const extensionPath = path.resolve('./build.crx');
//         const EXTENSION_ID = "goikhgffpigmooahdiabmipldbkeebnd";
//         let options = new chrome.Options();
//         options.addArguments(`--load-extension=${extensionPath}`);

//         driver = await new Builder()
//             .forBrowser(Browser.CHROME)
//             .setChromeOptions(options)
//             .build();

//     });

//     after(async () => await driver.quit());

//     it("should click register button"), async function () {
//         await driver.get("https://webauthn.io/");
//         let title = await driver.getTitle();
//         assert.equal("WebAuthn.io", title)
//         // await driver.manage().setTimeouts({ implicit: 500 });
//         await driver.sleep(2000);
//         let inputBox = await driver.findElement(By.id("input-email"));
//         let registerBtn = await driver.findElement(By.id("register-button"));
//         // Take action on element
//         await inputBox.sendKeys("SeleniumTest");
//         await registerBtn.click();
//     }
// })

(async function firstTest() {
    let driver;
    try {
        const extensionPath = path.resolve('../build/');
        // const extensionPath = path.resolve('./build.crx');
        const EXTENSION_ID = "goikhgffpigmooahdiabmipldbkeebnd";
        let options = new chrome.Options();
        options.addArguments(`--load-extension=${extensionPath}`);




        driver = await new Builder()
            .forBrowser(Browser.CHROME)
            .setChromeOptions(options)
            .build();

        // let options = new chrome.Options();
        // options.addExtensions(extensionPath);
        // driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();

        await driver.get("https://webauthn.io/");
        let title = await driver.getTitle();
        assert.equal("WebAuthn.io", title)
        await driver.manage().setTimeouts({ implicit: 500 });

        let inputBox = await driver.findElement(By.id("input-email"));
        let registerBtn = await driver.findElement(By.id("register-button"));

        // Take action on element
        await inputBox.sendKeys("SeleniumTest");
        await registerBtn.click();
        await driver.manage().setTimeouts({ implicit: 1000 });
        let userPresenceModal = await driver.findElement(By.className("userPresenceModal"));
        await driver.wait(until.elementIsVisible(driver.findElement(By.className("userPresenceModal"))), 1000);
        console.log("Fetching user presence body content and asserting it");
        // await driver.manage().setTimeouts({ implicit: 1000 });
        let userPresenceModalBody = await driver.findElement(By.className("userPresenceModalBody"));
        await driver.wait(until.elementIsVisible(driver.findElement(By.className("userPresenceModalBody"))), 1000);

        // assert.equal(userPresenceModalBody.getText(), "Would you like to create a new FIDO2 credential?", "Verify modal body message");
        // User presence modal (content script)
        // let yesBtn = await driver.findElement(By.id("yesBtn"));
        // await driver.manage().setTimeouts({ implicit: 3000 });

        let yesBtn = userPresenceModal.findElement(By.xpath(".//button[contains(text(), 'Yes')]"));
        yesBtn.click();
        // await driver.manage().setTimeouts({ implicit: 3000 });

        // successful register message
        // let successMessage = await driver.findElement(By.className("alert"));
        // let successMessageContainer = await driver.findElement(By.className("col-sm-12"));
        // await driver.wait(until.elementIsVisible(driver.findElement(By.className("col-sm-12"))), 1000);
        // console.log("success message container: ", successMessageContainer)
        // let value = await successMessageContainer.getText();
        // assert.equal("Received!", value)
        // await driver.manage().setTimeouts({ implicit: 3000 });
        // driver.sleep(5000).then(() => {
        //     //Step 4
        //     driver.findElement(By.css('.alert')).getText().then(function (txt) {
        //         console.log("The alert success text is : " + txt);
        //         assert.equal("Success! Now try to authenticate...", txt);
        //     })
        // });


        await driver.wait(until.elementLocated(By.css(".alert"))).then(el => el.getText()
            .then(x => assert.equal("Success! Now try to authenticate...", x)));

        // open the side panel

        const initialWindow = await driver.getAllWindowHandles();
        assert.strictEqual(initialWindow.length, 1);

        await driver.switchTo().newWindow("tab");
        await driver.get(`chrome-extension://${EXTENSION_ID}/side_panel.html`);

        const browserTabs = await driver.getAllWindowHandles();
        assert.strictEqual(browserTabs.length, 2);


        let fidoutilsConfigButton = await driver.findElement(By.id("triggerBtn"));
        fidoutilsConfigButton.click();

        // end of opening the side panel




        // driver.sleep(2000).then(() => {
        //     driver.findElement(By.id("login-button")).click();
        // })

        // let authenticateBtn = await driver.findElement(By.id("login-button"));
        // authenticateBtn.click();

        // let value = await successMessage.getText();
        // assert.equal("Received!", value)
        // await driver.manage().setTimeouts({ implicit: 1000 });
        // await driver.sleep(5000)
        // console.log("success message container: ", successMessageContainer)

        // let successMessage = successMessageContainer.findElement(By.xpath(".//div[@class='alert']"));
        // console.log("success message: ", successMessage)
        // let value = await successMessage.getText();
        // assert.equal("Received!", value)


        // Test authentication

        // driver.sleep(2000).then(() => {
        //     driver.findElement(By.id("login-button")).click();
        // })

        // await driver.manage().setTimeouts({ implicit: 10000 });
        // authenticateBtn.click();
        // await driver.manage().setTimeouts({ implicit: 3000 });

        // let message = await driver.findElement(By.className("alert"))
        // Request element information

    } catch (e) {
        console.log(e);
    } finally {
        // End the session
        // await driver.quit();
    }
}());


// firstTest();

