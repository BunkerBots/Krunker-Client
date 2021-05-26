/* eslint-disable no-unused-vars */
const { app, BrowserWindow, screen, globalShortcut } = require('electron');
const path = require('path');
const { keys } = require('./javascript/functions');
const krunkerurl = 'https://krunker.io/';
const Store = require('electron-store');
const store = new Store();
let display;

if (!app.requestSingleInstanceLock()) app.quit();


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
            preload: path.join(__dirname, 'splash.js')
        }
    });
    win.loadFile('src/html/splash.html');
    return win;
}

function initClient(url, webContents) {
    const { width, height } = screen.getPrimaryDisplay().workArea;
    const win = new BrowserWindow({
        width: width,
        height: height,
        center: true,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    const contents = win.webContents;

    keys(win, initClient, app, true);
    if (!webContents) win.loadURL(url);
    return win;
}


app.once('ready', async() => {
    const splash = initSplashWindow();
    const mainWin = initClient(krunkerurl);
    mainWin.once('ready-to-show', async() => {
        wait(10000).then(() => {
            splash.destroy();
            mainWin.show();
        });
    });
});
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
// app.whenReady().then(() => {
//     initClient();
// });

// app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
// });
// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') app.quit();
// });

app.on('quit', () => {
    app.quit();
});

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') app.quit();
});
