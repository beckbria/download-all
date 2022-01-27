const browser = require("webextension-polyfill");

function initializePageAction(tab) {
    browser.pageAction.show(tab.id);
}

browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
    initializePageAction(tab);
});

browser.runtime.onMessage.addListener((message) => {
    if (message.action === "saveAs") {
        browser.downloads.download({
            url: message.url
        }).catch((e) => {
            console.error(e.message);
        });
    } else {
        console.warn(`Unknown action: ${message.action}`);
    }
});

browser.pageAction.onClicked.addListener(() => {
    browser.tabs.executeScript({file: "/content_scripts/index.js"})
        .catch((e) => {
            console.error(e.message);
        });
});

browser.tabs.query({}).then((tabs) => {
    for (const tab of tabs) {
        initializePageAction(tab);
    }
});
