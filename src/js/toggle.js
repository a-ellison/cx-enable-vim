function setIcon(enabled) {
  if (enabled) {
    browser.action.setIcon({ path: "icon.png" });
  } else {
    browser.action.setIcon({ path: "icon-grayscale.png" });
  }
}

// initialize icon to match current value of `enabled`
browser.storage.local.get({ enabled: true }).then((results) => {
  setIcon(results.enabled);
});

// toggle extension when icon is clicked
browser.action.onClicked.addListener(() => {
  browser.storage.local.get({ enabled: true }).then((results) => {
    let enabled = !results.enabled;
    setIcon(enabled);
    browser.storage.local.set({ enabled });
  });
});
