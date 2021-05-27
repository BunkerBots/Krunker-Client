/**
 * Krunker Client URL validator
 * @param {string} url
 * @returns validated URL (social || external || viewer || editor || unknown || docs)
 */

function evalURL(url = '') {
    if (!isValidURL(url)) return 'unknown';

    const target = new URL(url);
    if (/^(www|comp\.)?krunker\.io$/.test(target.hostname)) {
        if (/^\/docs\/.+\.txt$/.test(target.pathname))
            return 'docs';

        switch (target.pathname) {
        case '/': return 'game';
        case '/social.html': return 'social';
        case '/viewer.html': return 'viewer';
        case '/editor.html': return 'editor';
        default: return 'unknown';
        }
    } else
        return 'external';
}

function isValidURL(url = '') {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = { evalURL };
