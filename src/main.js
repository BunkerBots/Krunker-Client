const { app, BrowserWindow, screen } = require('electron'),
    path = require('path');
let display;

if (!app.requestSingleInstanceLock()) app.quit();

function initClient() {
    const win = new BrowserWindow({
        width: 1600,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    win.loadURL('https://krunker.io/');
    // win.loadFile('src/html/index.html');
}

function initSplashWindow() {
    const win = new BrowserWindow({
        width: 600,
        height: 300,
        center: true,
        resizable: false,
        show: false,
        frame: false,
        transparent: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload/splash.js')
        }
    });
    const contents = win.webContents;

    launchGame();

    function launchGame() {
        initClient('https://krunker.io/');
        setTimeout(() => win.destroy(), 2000);
    }
}


app.once('ready', () => {
    initClient();
});
// app.whenReady().then(() => {
//     const displayRes = screen.getPrimaryDisplay().workArea;
//     display = displayRes;
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
