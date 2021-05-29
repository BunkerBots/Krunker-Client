const log = require('electron-log');

/**
 * Krunker Client auto updater
 * @param {*} contents window webcontents
 * @param {*} win window
 * @returns Promise
 */
async function autoUpdate(contents, win) {
    return new Promise((resolve, reject) => {
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        contents.on('dom-ready', () => {
            contents.send('message', 'Initializing auto updater plugin...');
            const { autoUpdater } = require('electron-updater');
            autoUpdater.logger = log;
            wait(2000).then(() => autoUpdater.checkForUpdates());
            autoUpdater.on('error', err => {
                console.error(err);
                contents.send('message', 'Auto update failed', err);
                wait(4000).then(() => reject(`Error: ${err}`));
            });
            autoUpdater.on('checking-for-update', () => {
                console.log('Checking for updates');
                contents.send('message', 'Checking for updates');
            });
            autoUpdater.on('update-not-available', () => {
                contents.send('message', 'No update available');
                wait(2000);
                resolve();
            });
            autoUpdater.on('update-available', info => {
                contents.send('message', `Update v${info.version} available`, info.releaseDate);
            });

            autoUpdater.on('download-progress', info => {
                contents.send('message', `Downloaded ${Math.floor(info.percent)}%`, Math.floor(info.bytesPerSecond / 1000) + 'kB/s');
                win.setProgressBar(info.percent / 100);
            });
            autoUpdater.on('update-downloaded', info => {
                contents.send('message', null, `Installing v${info.version}...`);
                autoUpdater.quitAndInstall(true, true);
            });
        });
    });
}

module.exports = { autoUpdate };

/**
 * Autoupdater events are only emitted after autoupdater.checkForUpdates();
 * wait() is used so that the dom content can be displayed before emitting the events
 */
