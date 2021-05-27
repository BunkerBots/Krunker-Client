/* eslint-disable no-unused-vars */
/**
 * Loading modules
 */
const { app, BrowserWindow, screen, clipboard } = require('electron');
const path = require('path');
const krunkerurl = 'https://krunker.io/';
const Store = require('electron-store');
const store = new Store();
const shortcuts = require('electron-localshortcut');
const { evalURL, autoUpdate } = require('./utils');
// const { initClient } = require('./client/client');

app.commandLine.appendSwitch('disable-frame-rate-limit');
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('disable-breakpad');
app.commandLine.appendSwitch('disable-component-update');
app.commandLine.appendSwitch('disable-print-preview');
app.commandLine.appendSwitch('disable-metrics');
app.commandLine.appendSwitch('disable-metrics-repo');
app.commandLine.appendSwitch('enable-javascript-harmony');
app.commandLine.appendSwitch('enable-future-v8-vm-features');
app.commandLine.appendSwitch('enable-webgl2-compute-context');
app.commandLine.appendSwitch('disable-hang-monitor');
app.commandLine.appendSwitch('no-referrers');
app.commandLine.appendSwitch('renderer-process-limit', 100);
app.commandLine.appendSwitch('max-active-webgl-contexts', 100);
app.commandLine.appendSwitch('enable-quic');
app.commandLine.appendSwitch('high-dpi-support', 1);
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('disable-2d-canvas-clip-aa');
app.commandLine.appendSwitch('disable-bundled-ppapi-flash');
app.commandLine.appendSwitch('disable-logging');
app.commandLine.appendSwitch('disable-web-security');
app.commandLine.appendSwitch('webrtc-max-cpu-consumption-percentage=100');

if (!app.requestSingleInstanceLock()) app.quit();

let game = null;
let splash = null;
let social = null;
// functions

/**
 * Keyboard shortcuts binder
 * @returns game window object
 */

function createShortcutKeys() {
    const contents = game.webContents;
    const clipboardURL = clipboard.readText();
    const type = evalURL(clipboardURL);
    // contents.on('dom-ready', () => {
    //     if (type == 'game') shortcuts.register(game, 'F3', () => createGameWindow(clipboardURL)); // load game from clipboard
    //     else if (type == 'social') shortcuts.register(game, 'F3', () => createSocialWindow(clipboardURL));
    // });
    shortcuts.register(game, 'Escape', () => contents.executeJavaScript('document.exitPointerLock()', true));
    shortcuts.register(game, 'F5', () => contents.reload()); // reload page
    shortcuts.register(game, 'Shift+F5', () => contents.reloadIgnoringCache());
    shortcuts.register(game, 'F11', () => { // toggle fullscreen
        if (!game.isFullScreen()) game.setFullScreen(true);
        else game.setFullScreen(false);
    });
    shortcuts.register(game, 'F2', () => clipboard.writeText(contents.getURL())); // copy URL to clipboard
    shortcuts.register(game, 'F6', () => { // reload client
        app.quit();
        createGameWindow('https://krunker.io/');
    });
    shortcuts.register(game, 'CommandOrControl+Shift+N', () => createGameWindow(contents.getURL()));
    return game;
}

/**
 * Creates a splash window for the client
 * @returns splash window (object)
 */

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
            preload: `${__dirname}/preload/splash.js`,
        }
    });
    console.log(`${__dirname}/preload/splash.js`);
    splash.loadFile('src/html/splash.html');
    return splash;
}

/**
 * Creates the main game window
 * @param {string} url
 * @param {*} webContents
 * @returns game window object
 */

function createGameWindow(url, webContents) {
    const { width, height } = screen.getPrimaryDisplay().workArea;
    game = new BrowserWindow({
        width: width,
        height: height,
        center: true,
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: `${__dirname}/preload/preload.js`,
            contextIsolation: false,
        }
    });
    const contents = game.webContents;
    createShortcutKeys();
    if (!webContents) game.loadURL(url);
    return game;
}

function createWindow(url, webContents) {
    const { width, height } = screen.getPrimaryDisplay().workArea;
    social = new BrowserWindow({
        width: width,
        height: height,
        center: true,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: false,
        }
    });
    if (!webContents) social.loadURL(url);
    return social;
}

/**
 * Main function, splash window + game window
 */

function initClient() { // splash and game
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    const splashScreen = createSplashWindow();
    const gameScreen = createGameWindow(krunkerurl.toString());
    gameScreen.once('ready-to-show', async() => {
        wait(3000).then(() => {
            splashScreen.destroy();
            gameScreen.show();
        });
        // autoUpdate(splash.webContents, splash).finally(() => {
        //     splash.destroy();
        //     gameScreen.show();
        // });
    });
}

/**
 * functions end
 * main events
 */
app.whenReady().then(() => {
    initClient();
});

app.on('quit', () => {
    app.quit();
});

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') app.quit();
});
// app.once('ready', async() => {
//     const splashScreen = createSplashWindow();
//     const gameScreen = createGameWindow(krunkerurl);
//     gameScreen.once('ready-to-show', async() => {
//         wait(10000).then(() => {
//             splashScreen.destroy();
//             gameScreen.show();
//         });
//     });
// });

// app.whenReady().then(() => {
//     initClient();
// });

// app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
// });
// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') app.quit();
// });