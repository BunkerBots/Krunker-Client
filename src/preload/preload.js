/* eslint-disable no-undef */
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const type of ['chrome', 'node', 'electron'])
        replaceText(`${type}-version`, process.versions[type]);
});

window.addEventListener('keydown', e => {
    switch (e.key) {
    case 'F3': window.home(); break;
    case 'F4': window.location.reload(); break;
    case 'Escape': escapeHandler(); break;
    default: break;
    }
});

// const escapeHandler = () => {
//     if (!(endUI.style.display === 'none')) {
//         menuHolder.style.display = 'block';
//         menuHider.style.display = 'block';
//         endUI.style.display = 'none';
//         uiBase.classList.add('onMenu');
//         instructionHolder.style.display = 'block';
//         overlay.style.display = 'none';
//     } else {
//         document.exitPointerLock =
//             document.exitPointerLock || document.mozExitPointerLock;
//         document.exitPointerLock();
//     }
// };
