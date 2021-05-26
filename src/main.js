/* eslint-disable no-unused-vars */
/**
 * Loading modules
 */
const { app, BrowserWindow, screen, clipboard } = require('electron');
const path = require('path');
const { keys } = require('./javascript/functions');
const krunkerurl = 'https://krunker.io/';
const Store = require('electron-store');
const store = new Store();
const shortcuts = require('electron-localshortcut');

if (!app.requestSingleInstanceLock()) app.quit();

let game = null;
let splash = null;
// functions

function createShortcutKeys() {
    const contents = game.webContents;
    shortcuts.register(game, 'Escape', () => contents.executeJavaScript('document.exitPointerLock()', true));
    shortcuts.register(game, 'F5', () => contents.reload());
    shortcuts.register(game, 'Shift+F5', () => contents.reloadIgnoringCache());
    shortcuts.register(game, 'F11', () => {
        if (!game.isFullScreen()) game.setFullScreen(true);
        else game.setFullScreen(false);
    });
    shortcuts.register(game, 'CommandOrControl+L', () => clipboard.writeText(contents.getURL()));
    shortcuts.register(game, 'F6', () => {
        app.quit();
        createGameWindow('https://krunker.io/');
    });
    shortcuts.register(game, 'CommandOrControl+Shift+N', () => createGameWindow(contents.getURL()));
    return game;
}

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

function createGameWindow(url, webContents) {
    const { width, height } = screen.getPrimaryDisplay().workArea;
    game = new BrowserWindow({
        width: width,
        height: height,
        center: true,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: false,
        }
    });
    const contents = game.webContents;
    createShortcutKeys();
    // keys(game, createGameWindow, app, true);
    if (!webContents) game.loadURL(url);
    return game;
}

function initClient() { // splash and game
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    const splashScreen = createSplashWindow();
    const gameScreen = createGameWindow(krunkerurl.toString());
    gameScreen.once('ready-to-show', async() => {
        wait(5000).then(() => {
            splashScreen.destroy();
            gameScreen.show();
        });
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

