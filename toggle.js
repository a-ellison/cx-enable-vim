// toggle extension when icon is clicked
browser.browserAction.onClicked.addListener(() => {
    browser.storage.local.get({ enabled: true }).then((results) => {
        let enabled = !results.enabled;
        if (enabled) {
            browser.browserAction.setIcon({ path: "icon.png" });
        } else {
            browser.browserAction.setIcon({ path: "icon-grayscale.png" });
        }
        browser.storage.local.set({ enabled });
    });
});
