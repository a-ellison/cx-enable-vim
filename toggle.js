let extensionEnabled = true;

browser.storage.local.get({ enabled: true }).then((results) => {
    extensionEnabled = results.enabled;
});

// toggle extension when icon is clicked
browser.browserAction.onClicked.addListener((tab) => {
    extensionEnabled = !extensionEnabled;
    browser.storage.local.set({ enabled: extensionEnabled });
    if (extensionEnabled) {
        browser.browserAction.setIcon({ path: "icon.png" });
    } else {
        browser.browserAction.setIcon({ path: "icon-grayscale.png" });
    }
});
