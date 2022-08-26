const w = window.wrappedJSObject;
const app = document.getElementById("app");
let path = window.location.pathname;
let connected = false;

function enable() {
  let script = document.createElement("script");
  script.src = browser.runtime.getURL("ace-keybinding-vim.js");
  script.onload = () => {
    for (let n of app.getElementsByClassName("ace_editor")) {
      e = n.wrappedJSObject.env.editor;
      e.setKeyboardHandler(w.ace.require("ace/keyboard/vim").handler);
    }
  };
  document.head.appendChild(script);
}

const observer = new MutationObserver((_, observer) => {
  if (app.getElementsByClassName("ace_editor").length > 0) {
    observer.disconnect();
    connected = false;
    enable();
  }
});

function setup() {
  if (!path.startsWith("/ide2")) {
    return;
  }
  observer.observe(app, {
    childList: true,
    subtree: true,
  });
  connected = true;
}

setup();

function onNavigation() {
  let currentPath = window.location.pathname;
  if (!connected && path !== currentPath) {
    path = currentPath;
    setup();
  }
}

window.addEventListener("popstate", onNavigation);
window.addEventListener("click", onNavigation);
