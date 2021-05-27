/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { ipcRenderer } = require('electron');

const tips = [
    'Use F5 to reload your page',
    'want to switch lobbies faster? hit F6'
];

window.addEventListener('DOMContentLoaded', () => {
    /**
     *
     * @param {string} selector
     * @param {string} text
     * @returns element
     */
    const viewTips = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerHTML = text;
        return element;
    };
    const tip = tips[Math.floor(Math.random() * tips.length)];
    viewTips('tips', `Tips: ${tip}`);
});
