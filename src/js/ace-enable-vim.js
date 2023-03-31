let scriptLoaded = false;
let extensionEnabled = true;

// makes sure to delete the script from head first if it already exists and then injects `file`
function reinjectScript(file) {
  let script = document.getElementById(file);
  if (script) {
    script.remove();
  }
  script = document.createElement("script");
  script.src = browser.runtime.getURL(file);
  script.id = file;
  document.head.appendChild(script);
}

function enableVimMode() {
  onload = () => {
    // inject script into DOM to set editor keyboard handler
    reinjectScript("js/set-vim-keyboard-handler.js");
  };
  // avoid adding the script to the document head multiple times
  if (!scriptLoaded) {
    let script = document.createElement("script");
    script.src = browser.runtime.getURL("js/ace-keybinding-vim.js");
    script.onload = onload;
    document.head.appendChild(script);
    scriptLoaded = true;
  } else {
    onload();
  }
}

function pageHasAceEditor() {
  return document.getElementsByClassName("ace_editor").length > 0;
}

function enable() {
  if (pageHasAceEditor()) {
    enableVimMode();
  }
}

browser.storage.local.get({ enabled: true }).then((results) => {
  extensionEnabled = results.enabled;
  if (extensionEnabled) {
    enable();
  }
});

/**
 * The "cxAceMounted" event is explicitly emitted by Code Expert to notify this extension.
 */
document.addEventListener(
  "cxAceMounted",
  () => {
    if (extensionEnabled) {
      enable();
    }
  },
  { capture: true }
);

browser.storage.local.onChanged.addListener((changes) => {
  extensionEnabled = changes.enabled.newValue;
  if (extensionEnabled) {
    enable();
  } else {
    reinjectScript("js/set-default-keyboard-handler.js");
  }
});
