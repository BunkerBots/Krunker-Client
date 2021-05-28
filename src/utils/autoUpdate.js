const log = require('electron-log');
// eslint-disable-next-line no-unused-vars
const version = require('../../package.json').version;

/**
 * Krunker Client auto updator
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
            wait(2000).then(() => {
                // contents.send('message', 'Checking for updates');
                autoUpdater.checkForUpdates().then(() => {
                    // if (x.updateInfo.version == version) contents.send('message', 'No updates found');
                    // else {
                    //     autoUpdater.on('update-available', info => {
                    //         contents.send('message', `Update v${info.version} available`, info.releaseDate);
                    //         resolve();
                    //     });
                    // }
                    wait(2000);
                    resolve();
                });
            });
            // eslint-disable-next-line max-statements-per-line
            // autoUpdater.checkForUpdates().then(() => { wait(2000); resolve(); });
            autoUpdater.on('error', err => {
                console.error(err);
                contents.send('message', `Error ${err.name}`);
                reject(`Error: ${err.name}`);
            });
            autoUpdater.on('checking-for-update', () => {
                console.log('Checking for updates');
                contents.send('message', 'Checking for updates');
                resolve();
            });
            autoUpdater.on('update-not-available', () => {
                contents.send('message', 'No update available');
                wait(2000);
                resolve();
            });
            autoUpdater.on('update-available', info => {
                contents.send('message', `Update v${info.version} available`, info.releaseDate);
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
        });
    });
}

module.exports = { autoUpdate };
