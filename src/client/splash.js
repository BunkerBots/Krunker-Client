const { BrowserWindow } = require('electron');
let splash = null;

function createSplashWindow() {
    splash = new BrowserWindow({
        width: 600,
        height: 300,
        center: true,
        resizable: false,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        webPreferences: {
            preload: `${__dirname}/splash.js`,
        }
    });
    splash.loadFile('src/html/splash.html');
    return splash;
}

module.exports = { createSplashWindow };
