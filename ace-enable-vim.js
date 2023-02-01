const w = window.wrappedJSObject;
let currentPath = window.location.pathname;
let observerAttached = false;
let scriptLoaded = false;
let extensionEnabled = true;

function pageHasAceEditor() {
  return document.getElementsByClassName("ace_editor").length > 0;
}

function enableVimMode() {
  onload = () => {
    for (let n of document.getElementsByClassName("ace_editor")) {
      e = n.wrappedJSObject.env.editor;
      e.setKeyboardHandler(w.ace.require("ace/keyboard/vim").handler);
      // solves a bug where
      if (!n.classList.contains("normal-mode")) {
        n.classList.add("normal-mode");
      }
    }
  };
  // avoid adding the script to the document head multiple times
  if (!scriptLoaded) {
    let script = document.createElement("script");
    script.src = browser.runtime.getURL("ace-keybinding-vim.js");
    script.onload = onload;
    document.head.appendChild(script);
    scriptLoaded = true;
  } else {
    onload();
  }
}

function enable() {
  if (pageHasAceEditor()) {
    enableVimMode();
  } else {
    attachObserver();
  }
}

function disableVimMode() {
  for (let n of document.getElementsByClassName("ace_editor")) {
    e = n.wrappedJSObject.env.editor;
    e.setKeyboardHandler("");
  }
}

const observer = new MutationObserver(() => {
  if (pageHasAceEditor()) {
    enableVimMode();
    detachObserver();
  }
});

function attachObserver() {
  const pathPrefixesToCXEditor = ["ide2", "solve"];
  if (
    pathPrefixesToCXEditor.some((prefix) =>
      currentPath.startsWith(`/${prefix}`)
    )
  ) {
    observer.observe(document, {
      childList: true,
      subtree: true,
    });
    observerAttached = true;
  }
}

function detachObserver() {
  observer.disconnect();
  observerAttached = false;
}

browser.storage.local.get({ enabled: true }).then((results) => {
  extensionEnabled = results.enabled;
  if (extensionEnabled) {
    enable();
  }
});

/**
 * Navigations occur without a proper page load. Thus this script will not get reloaded on navigations and if
 * the first load of the page is not the editor, we need to wait for an editor to appear to enable Vim mode.
 * To avoid having the Mutation Observer constantly active, we try to detect navigations, enable the Mutation
 * Observer if on a page that will have an editor and immediately detach the observer once Vim mode has been enabled.
 */
function onNavigation() {
  if (!extensionEnabled) return;
  let newPath = window.location.pathname;
  if (!observerAttached && currentPath !== newPath) {
    currentPath = newPath;
    enable();
  }
}

window.addEventListener("popstate", onNavigation);
window.addEventListener("click", onNavigation);

browser.storage.local.onChanged.addListener((changes) => {
  extensionEnabled = changes.enabled.newValue;
  if (extensionEnabled) {
    enable();
    // keep track of current path again (might have changed since add-on was disabled)
    currentPath = window.location.pathname;
  } else {
    if (observerAttached) {
      detachObserver();
    }
    disableVimMode();
  }
});
