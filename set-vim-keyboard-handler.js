/**
 * It's necessary to inject this file into the page's DOM to be able to access the attribute `.env` of the node.
 * Content scripts run in an isolated execution environment and cannot see modifications to DOM nodes done via JavaScript, which
 * is how the `env` attribute is added.
 */
for (let n of document.getElementsByClassName("ace_editor")) {
  e = n.env.editor;
  e.setKeyboardHandler(window.ace.require("ace/keyboard/vim").handler);
}
