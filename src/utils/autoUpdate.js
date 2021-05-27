const { autoUpdater } = require('electron-updater');

/**
 * Krunker Client auto updator
 * @param {*} contents window webcontents
 * @param {*} win window
 * @returns Promise
 */
async function autoUpdate(contents, win) {
    return new Promise((resolve, reject) => {
        contents.on('dom-ready', () => {
            contents.send('message', 'Initializing auto updater plugin...');
            autoUpdater.on('error', err => {
                console.error(err);
                contents.send('message', `Error ${err.name}`);
                reject(`Error: ${err.name}`);
            });
            autoUpdater.on('checking-for-update', () => contents.send('message', 'Checking for update'));
            autoUpdater.on('update-available', info => {
                contents.send('message', `Update v${info.version} available`, info.releaseDate);
                resolve();
            });
            autoUpdater.on('update-not-availabe', info => {
                console.log(info);
                contents.send('message', 'No update available');
                resolve();
            });
            autoUpdater.on('download-progress', info => {
                contents.send('message', `Downloaded ${Math.floor(info.percent)}%`, Math.floor(info.bytesPerSecond / 1000) + 'kB/s');
                win.setProgressBar(info.percent / 100);
            });
            autoUpdater.on('update-downloaded', info => {
                contents.send('message', null, `Installing v${info.version}...`);
                autoUpdater.quitAndInstall(true, true);
            });
            autoUpdater.checkForUpdates();
        });
    });
}

module.exports = { autoUpdate };
