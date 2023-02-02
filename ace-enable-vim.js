const app = document.getElementById("app");
let path = window.location.pathname;
let observerAttached = false;
let scriptLoaded = false;
let extensionEnabled = true;

// makes sure to delete the script from head first if it already exists and then injects `file`
function reinjectScript(file) {
    let script = document.getElementById(file)
    if (script) {
        script.remove()
    }
    script = document.createElement("script");
    script.src = browser.runtime.getURL(file);
    script.id = file
    document.head.appendChild(script);
}

function tryEnable() {
    if (app.getElementsByClassName("ace_editor").length > 0) {
        onload = () => {
            // inject script into DOM to set editor keyboard handler
            reinjectScript("set-vim-keyboard-handler.js")
        };
        if (!scriptLoaded) {
            let script = document.createElement("script");
            script.src = browser.runtime.getURL("ace-keybinding-vim.js");
            script.onload = onload;
            document.head.appendChild(script);
            scriptLoaded = true;
        } else {
            onload();
        }
        return true;
    }
    return false;
}

const observer = new MutationObserver((_, observer) => {
    if (tryEnable()) {
        observer.disconnect();
        observerAttached = false;
    }
});

function attachObserver() {
    if (!path.startsWith("/ide2")) {
        return;
    }
    observer.observe(app, {
        childList: true,
        subtree: true,
    });
    observerAttached = true;
}

browser.storage.local.get({ enabled: true }).then((results) => {
    extensionEnabled = results.enabled;
    if (extensionEnabled) {
        if (!tryEnable()) {
            attachObserver();
        }
    }
});

function onNavigation() {
    if (!extensionEnabled) return;
    let currentPath = window.location.pathname;
    if (!observerAttached && path !== currentPath) {
        path = currentPath;
        attachObserver();
    }
}

window.addEventListener("popstate", onNavigation);
window.addEventListener("click", onNavigation);

browser.storage.local.onChanged.addListener((changes) => {
    extensionEnabled = changes.enabled.newValue;
    if (extensionEnabled) {
        if (!tryEnable()) {
            attachObserver();
        }
    } else {
        if (observerAttached) {
            observer.disconnect();
            observerAttached = false;
        }
        reinjectScript("set-default-keyboard-handler.js")
        path = "";
    }
});
