const electron = require('electron');
const { BrowserWindow, app, screen } = electron;
const path = require('path');
const shortcuts = require('electron-localshortcut');
class AtomClient {

    constructor() {
    }

    init(url) {
        function initClient(webContents) {
            const { width, height } = screen.getPrimaryDisplay().workArea;
            const window = new BrowserWindow({
                width: width,
                height: height,
                center: true,
                show: false,
                webPreferences: {
                    preload: path.join(__dirname, 'preload.js')
                }
            });
            keys(window);
            if (!webContents) window.loadURL(url);
            return window;
        }

        function keys(win) {
            shortcuts.register(win, 'CommandOrControl+N', () => initClient('https://krunker.io/'));
        }

        function initSplashWindow() {
            const win = new BrowserWindow({
                width: 600,
                height: 300,
                center: true,
                resizable: false,
                frame: false,
                transparent: true,
                alwaysOnTop: true,
                webPreferences: {
                    preload: path.join('../preload', 'preload.js')
                }
            });
            win.loadFile('../html/splash.html');
            return win;
        }

        app.once('ready', () => {
            const splash = initSplashWindow();
            const mainWin = initClient();
            mainWin.once('ready-to-show', () => {
                splash.destroy();
                mainWin.show();
            });
        });

        app.on('quit', () => app.quit());
    }

}

module.exports = AtomClient;
