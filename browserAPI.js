// browserApi.js
class BrowserApi {
    static isChromeApi = navigator.userAgent.includes("Chrome");
    static isFirefoxApi = navigator.userAgent.includes("Firefox");

    static get runtime() {
        return this.isChromeApi ? chrome.runtime : browser.runtime;
    }

    static get sidePanel() {
        if (this.isChromeApi) {
            return chrome.sidePanel;
        } else if (this.isFirefoxApi) {
            return browser.sidebarAction;
        }
        return null;
    }
}