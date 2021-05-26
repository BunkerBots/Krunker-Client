/* eslint-disable no-undef */

const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const version = document.getElementById('version');
    const versionJSON = require('../data/core.json').version.toString();
    // version.innerText = versionJSON;
    ipcRenderer.on('change-text-element', (event, data) => {
        document.getElementById('version').innerHTML = versionJSON;
    });
});
