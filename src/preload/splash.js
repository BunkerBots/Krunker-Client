/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { ipcRenderer } = require('electron');
const { version } = require('../data/core.json');
const tips = [
    'Use F5 to reload your page',
    'want to switch lobbies faster? hit F6',
    'Hit F2 to copy the current game link to your clipboard'
];

window.addEventListener('DOMContentLoaded', () => {
    /**
     *
     * @param {string} selector
     * @param {string} text
     * @returns element
     */
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
        return element;
    };
    const tip = tips[Math.floor(Math.random() * tips.length)];
    replaceText('tips', `Tips: ${tip}`);
    replaceText('version', `v${version}`);

    const details = document.getElementById('details');
    const message = document.getElementById('message');
    ipcRenderer.on('message', (event, messageText = '', detailsText = '') => {
        if (messageText != null) message.innerText = messageText;

        if (detailsText != null) details.innerText = detailsText;
    });
});

