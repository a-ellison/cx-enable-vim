function setIcon(enabled) {
  if (enabled) {
    browser.browserAction.setIcon({ path: "icon.png" });
  } else {
    browser.browserAction.setIcon({ path: "icon-grayscale.png" });
  }
}

// initialize icon to match current value of `enabled`
browser.storage.local.get({ enabled: true }).then((results) => {
  setIcon(results.enabled);
});

// toggle extension when icon is clicked
browser.browserAction.onClicked.addListener(() => {
  browser.storage.local.get({ enabled: true }).then((results) => {
    let enabled = !results.enabled;
    setIcon(enabled);
    browser.storage.local.set({ enabled });
  });
});
