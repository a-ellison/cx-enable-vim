// 1. Disable Content Security Policy in the browser. In Firefox the extension https://addons.mozilla.org/en-US/firefox/addon/mheadercontrol/ can be used for this.
// 2. Run the following in the developer console, when editing some file on Code Expert
function addScript(url) {
    script = document.createElement("script");
    script.src = url;
    document.head.appendChild(script);
}
addScript("https://rawgit.com/ajaxorg/ace-builds/master/src-min-noconflict/keybinding-vim.js")
editor = document.getElementById("ace-editor").env.editor
editor.setKeyboardHandler(window.ace.require("ace/keyboard/vim").handler)
