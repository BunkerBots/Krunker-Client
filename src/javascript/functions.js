/* eslint-disable no-undef */
const shortcuts = require('electron-localshortcut');
const { clipboard } = require('electron');

function keys(win, client, app) {
    const contents = win.webContents;
    shortcuts.register(win, 'Escape', () => contents.executeJavaScript('document.exitPointerLock()', true));
    shortcuts.register(win, 'F5', () => contents.reload());
    shortcuts.register(win, 'Shift+F5', () => contents.reloadIgnoringCache());
    shortcuts.register(win, 'F11', () => win.setFullScreen(!win.isFullScreen()));
    shortcuts.register(win, 'CommandOrControl+L', () => clipboard.writeText(contents.getURL()));
    shortcuts.register(win, 'F6', () => {
        app.quit();
        client('https://krunker.io/');
    });
    shortcuts.register(win, 'CommandOrControl+Shift+N', () => client(contents.getURL()));
    return win;
}


module.exports = { keys };
